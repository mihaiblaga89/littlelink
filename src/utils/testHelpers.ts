// eslint-disable-next-line import/no-unresolved
import { APIGatewayProxyEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';

export const context: Partial<Context> = {};
export const callback: APIGatewayProxyCallback = () => true;
export const hashAndStatsEvent = (url): Partial<APIGatewayProxyEvent> => ({
  body: `{"url":"${url}"}`,
  requestContext: {
    accountId: '',
    apiId: '',
    authorizer: [''],
    protocol: '',
    httpMethod: '',
    identity: {
      accessKey: '',
      accountId: '',
      apiKey: '',
      apiKeyId: '',
      caller: '',
      cognitoAuthenticationProvider: '',
      cognitoAuthenticationType: '',
      cognitoIdentityId: '',
      cognitoIdentityPoolId: '',
      principalOrgId: '',
      sourceIp: '127.0.0.1',
      user: '',
      userAgent: '',
      userArn: '',
    },
    path: '',
    stage: '',
    requestId: '',
    requestTimeEpoch: 0,
    resourceId: '',
    resourcePath: '',
  },
});
export const urlEvent = (hash: string): Partial<APIGatewayProxyEvent> => ({
  queryStringParameters: { hash },
});
