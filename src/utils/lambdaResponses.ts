// eslint-disable-next-line import/no-unresolved
import { APIGatewayProxyResult } from 'aws-lambda';

export function success(data: object): APIGatewayProxyResult {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(data),
  };
}

export function failure(err: Error | string = 'Unknown error occured', statusCode: number = 500): APIGatewayProxyResult {
  // get the error message if it's an Error
  const error = err instanceof Error ? err.message : err;
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ error }),
  };
}
