import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import shortid from 'shortid';
import moment from 'moment';

import { addLink, getLinkByHash, getStatisticsByURL, removeOlderThan } from '../linkController';
import { ILink, ILinkStats } from '../../types';
import Link from '../../models/link.model';

let mongoServer: MongoMemoryServer;

describe('Link model', () => {
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri: string = await mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('Should save new link and query it correctly', async () => {
    expect.assertions(3);

    const newLink: ILink = await addLink('example.com', '1.1.1.1');

    // query what we added
    const queryResponse: ILink = (await getLinkByHash(newLink.hash)) as ILink;

    expect(queryResponse.url).toBe(newLink.url);
    expect(queryResponse.url).toBe('example.com');
    // check that the hash is correct and url friendly
    expect(shortid.isValid(queryResponse.hash)).toBe(true);
  });

  it('Should save multiple links, query all correctly and get the correct status', async () => {
    expect.assertions(3);
    const links: string[][] = [
      ['example.com', '1.1.1.1'],
      ['example.com', '2.2.2.2'],
      ['example.com', '3.3.3.3'],
    ];

    // save multiple links
    await Promise.all(links.map(lnk => addLink(lnk[0], lnk[1])));

    // query what we added
    const queryResponse: ILinkStats = (await getStatisticsByURL('example.com')) as ILinkStats;
    expect(queryResponse.url).toBe('example.com');
    expect(queryResponse.hashes.length).toBe(4);
    expect(queryResponse.ipAddresses).toEqual(['1.1.1.1', '2.2.2.2', '3.3.3.3']);
  });

  it('Should return non existent stats for a missing link', async () => {
    expect.assertions(1);

    const exists: boolean = (await getStatisticsByURL('nonexistent.com')) as boolean;
    expect(exists).toBe(false);
  });

  it('Should delete links older than 1 year', async () => {
    expect.assertions(2);

    const forgedLink: ILink = new Link({
      url: 'forgedDate.com',
      hash: 'forgedHash',
      ipAddress: '1.2.3.4',
      requested: 0,
      createdAt: moment()
        .subtract({ years: 2 })
        .toDate(),
    });
    await forgedLink.save();

    const recentlyAdded: ILink = (await getLinkByHash('forgedHash')) as ILink;
    expect(recentlyAdded.url).toBe('forgedDate.com');

    // clean it up
    await removeOlderThan({ years: 1 });

    // shouldn't exist anymore
    const exists: boolean = (await getLinkByHash('forgedHash')) as boolean;
    expect(exists).toBe(false);
  });
});
