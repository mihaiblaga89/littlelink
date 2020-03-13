// eslint-disable-next-line import/no-unresolved
import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { isURL } from 'validator';

import { IHashInput, ILink } from './types';
import { success, failure } from './utils/lambdaResponses';
import { addLink } from './controllers/linkController';
import DB from './db';

const { MONGODB_URI } = process.env;

export const hash: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  let body: IHashInput;

  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return <APIGatewayProxyResult>failure(e);
  }

  // validations
  if (!body.url) return <APIGatewayProxyResult>failure('URL not provided');
  if (!isURL(body.url)) return <APIGatewayProxyResult>failure('Not a valid URL');

  await DB.init(MONGODB_URI);
  const { sourceIp } = event.requestContext.identity;
  const newLink: ILink = await addLink(body.url, sourceIp);

  await DB.teardown();
  return success({ hash: newLink.hash });
};

export const url: APIGatewayProxyHandler = async event => {};

// export const stats: APIGatewayProxyHandler = async event => {};

// export const deleteCron: APIGatewayProxyHandler = async event => {};
