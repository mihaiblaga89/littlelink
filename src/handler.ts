// eslint-disable-next-line import/no-unresolved
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { isURL } from 'validator';
import shortid from 'shortid';

import { IHashInput, ILink } from './types';
import { success, failure } from './utils/lambdaResponses';
import { addLink, getLinkByHash } from './controllers/linkController';
import DB from './db';

const { MONGODB_URI } = process.env;

export const hash: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  let body: IHashInput;

  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return <APIGatewayProxyResult>failure(e);
  }

  const ip: string | boolean = event.requestContext?.identity?.sourceIp;

  // validations
  if (!body.url) return <APIGatewayProxyResult>failure('URL not provided', 400);
  if (!isURL(body.url)) return <APIGatewayProxyResult>failure('Not a valid URL', 400);
  if (!ip) return <APIGatewayProxyResult>failure('Who are you?', 403);

  await DB.init(MONGODB_URI);
  const newLink: ILink = await addLink(body.url, ip);

  await DB.teardown();
  return <APIGatewayProxyResult>success({ hash: newLink.hash });
};

export const url: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const hashParam: string | boolean = event.queryStringParameters?.hash;

  // validations
  if (!hashParam) return <APIGatewayProxyResult>failure('Hash not provided', 400);
  if (!shortid.isValid(hashParam)) return <APIGatewayProxyResult>failure('Malformed hash provided', 400);

  await DB.init(MONGODB_URI);
  const link: ILink | boolean = await getLinkByHash(hashParam);
  await DB.teardown();

  if (!link) return <APIGatewayProxyResult>failure(`No link with hash ${hashParam}`, 404);

  const linkUrl: string = (link as ILink).url;

  return <APIGatewayProxyResult>success({ url: linkUrl });
};

// export const stats: APIGatewayProxyHandler = async event => {};

// export const deleteCron: APIGatewayProxyHandler = async event => {};
