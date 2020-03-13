// eslint-disable-next-line import/no-unresolved
import { APIGatewayProxyResult, APIGatewayProxyEvent, Context } from 'aws-lambda';
import { MongoMemoryServer } from 'mongodb-memory-server';
import shortid from 'shortid';

import { urlHandler, hashHandler, cronHandler, statsHandler } from '../handler';
import { urlEvent, hashAndStatsEvent, context, callback } from '../utils/testHelpers';

let mongoServer: MongoMemoryServer;

describe('Lambda handlers', () => {
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri: string = await mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri; // handlers get it from ENV
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  it('URL handler should return correct hash', async () => {
    expect.assertions(2);

    const response: APIGatewayProxyResult = (await hashHandler(
      hashAndStatsEvent('example.com') as APIGatewayProxyEvent,
      context as Context,
      callback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(shortid.isValid(JSON.parse(response.body).hash)).toBe(true);
  });

  it('URL handler should return malformed error', async () => {
    expect.assertions(2);

    const response: APIGatewayProxyResult = (await hashHandler({} as APIGatewayProxyEvent, context as Context, callback)) as APIGatewayProxyResult;
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual('{"error":"Malformed request"}');
  });

  it('Hash handler should return correct link', async () => {
    expect.assertions(2);
    // add one
    const added: APIGatewayProxyResult = (await hashHandler(
      hashAndStatsEvent('example.com') as APIGatewayProxyEvent,
      context as Context,
      callback,
    )) as APIGatewayProxyResult;

    // expect to find it
    const response: APIGatewayProxyResult = (await urlHandler(
      urlEvent(JSON.parse(added.body).hash) as APIGatewayProxyEvent,
      context as Context,
      callback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).url).toBe('example.com');
  });

  it('Stats handler should return correct stats', async () => {
    expect.assertions(4);

    const response: APIGatewayProxyResult = (await statsHandler(
      hashAndStatsEvent('example.com') as APIGatewayProxyEvent,
      context as Context,
      callback,
    )) as APIGatewayProxyResult;

    const body = JSON.parse(response.body);
    const { url, ipAddresses, requests } = body;

    expect(response.statusCode).toBe(200);
    expect(url).toBe('example.com');
    expect(ipAddresses).toEqual(['127.0.0.1']);
    expect(requests).toBe(1);
  });

  it('Cron should return success', async () => {
    expect.assertions(1);

    const response: boolean = await cronHandler();

    expect(response).toBe(true);
  });
});
