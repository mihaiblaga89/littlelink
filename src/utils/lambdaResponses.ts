// eslint-disable-next-line import/no-unresolved
import { APIGatewayProxyResult } from 'aws-lambda';
/**
 * Provides success response to API Gateway
 *
 * @export
 * @param {object} data Data to be returned to API Gateway
 * @returns {APIGatewayProxyResult}
 */
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

/**
 * Provides failure response to API Gateway
 *
 * @export
 * @param {(Error | string)} [err='Unknown error occured'] Error to be returned to API Gateway
 * @param {number} [statusCode=500] Status code
 * @returns {APIGatewayProxyResult}
 */
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
