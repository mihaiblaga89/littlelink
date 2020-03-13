// eslint-disable-next-line import/no-unresolved
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { isURL, isIP } from 'validator';
import shortid from 'shortid';

import { ILink, ILinkStats } from './types';
import { success, failure } from './utils/lambdaResponses';
import { addLink, getLinkByHash, getStatisticsByURL, removeOlderThan } from './controllers/linkController';
import DB from './db';

export const hashHandler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  let url: string;

  try {
    url = JSON.parse(event.body).url;
  } catch (e) {
    return <APIGatewayProxyResult>failure('Malformed request', 400);
  }

  const ip: string | boolean = event.requestContext?.identity?.sourceIp;

  // validations
  if (!url) return <APIGatewayProxyResult>failure('URL not provided', 400);
  if (!isURL(url)) return <APIGatewayProxyResult>failure('Not a valid URL', 400);
  if (!ip) return <APIGatewayProxyResult>failure('Who are you?', 403);
  if (!isIP(ip)) return <APIGatewayProxyResult>failure('Nice try', 403);

  const { MONGODB_URI } = process.env;
  await DB.init(MONGODB_URI);
  const newLink: ILink = await addLink(url, ip);
  await DB.teardown();

  return <APIGatewayProxyResult>success({ hash: newLink.hash });
};

export const urlHandler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const hashParam: string | boolean = event.queryStringParameters?.hash;

  // validations
  if (!hashParam) return <APIGatewayProxyResult>failure('Hash not provided', 400);
  if (!shortid.isValid(hashParam)) return <APIGatewayProxyResult>failure('Malformed hash provided', 400);

  const { MONGODB_URI } = process.env;
  await DB.init(MONGODB_URI);
  const link: ILink | boolean = await getLinkByHash(hashParam);
  await DB.teardown();

  if (!link) return <APIGatewayProxyResult>failure(`No link with hash ${hashParam}`, 404);

  const linkUrl: string = (link as ILink).url;
  return <APIGatewayProxyResult>success({ url: linkUrl });
};

export const statsHandler: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  let url: string;

  try {
    url = JSON.parse(event.body).url;
  } catch (e) {
    return <APIGatewayProxyResult>failure('Malformed request', 400);
  }

  // validations
  if (!url) return <APIGatewayProxyResult>failure('URL not provided', 400);
  if (!isURL(url)) return <APIGatewayProxyResult>failure('Not a valid URL', 400);

  const { MONGODB_URI } = process.env;
  await DB.init(MONGODB_URI);
  const response: ILinkStats | boolean = await getStatisticsByURL(url);
  await DB.teardown();

  if (!response) return <APIGatewayProxyResult>failure(`Link not found`, 404);

  const statistics = response as ILinkStats;
  const { hashes, ipAddresses, requests } = statistics;

  return <APIGatewayProxyResult>success({ url, hashes, ipAddresses, requests });
};

export const cronHandler = async (): Promise<boolean> => {
  const { MONGODB_URI } = process.env;
  await DB.init(MONGODB_URI);
  await removeOlderThan(1);
  await DB.teardown();
  return true;
};
