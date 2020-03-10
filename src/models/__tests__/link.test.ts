import { connect, disconnect } from 'mongoose';
import MongoMemoryServer from 'mongodb-memory-server';
import moment from 'moment';

import { Link, ILink } from '../link.model';

let mongoServer;

describe('Link model', () => {
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri: String = await mongoServer.getUri();
    await connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await disconnect();
    await mongoServer.stop();
  });

  it('Should throw validation errors', () => {
    const link: ILink = new Link();

    expect(link.validate).toThrow();
  });

  it('Should save link', async () => {
    expect.assertions(3);

    const link: ILink = new Link({
      url: 'example.com',
      hash: 'hashExample.com',
      ipAddress: ['123.123.123.123', '1.1.1.1'],
      requested: 2,
    });
    const spy: spyOn = jest.spyOn(link, 'save');

    await link.save();

    expect(spy).toHaveBeenCalled();

    expect(link.hash).toBe('hashExample.com');
    expect(moment(link.createdAt).isValid()).toBe(true);
  });
});
