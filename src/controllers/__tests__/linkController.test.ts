import { MongoMemoryServer } from 'mongodb-memory-server';
import shortid from 'shortid';

import { addLink, getLinkByHash, getStatisticsByURL, removeOlderThan } from '../linkController';
import { ILink, ILinkStats } from '../../types';
import Link from '../../models/link.model';
import DB from '../../db';

let mongoServer: MongoMemoryServer;

describe('Link Controller', () => {
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri: string = await mongoServer.getUri();
    await DB.init(mongoUri);
  });

  afterAll(async () => {
    await DB.teardown();
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

  it('Should save multiple links, query all correctly and get the correct stats', async () => {
    expect.assertions(3);
    const links: string[][] = [
      ['anotherExample.com', '1.1.1.1'],
      ['anotherExample.com', '2.2.2.2'],
      ['anotherExample.com', '3.3.3.3'],
      ['notExample.com', '4.4.4.4'],
    ];

    // save multiple links
    await Promise.all(links.map(lnk => addLink(lnk[0], lnk[1])));

    // query what we added
    const queryResponse: ILinkStats = (await getStatisticsByURL('anotherExample.com')) as ILinkStats;
    expect(queryResponse.url).toBe('anotherExample.com');
    expect(queryResponse.hashes.length).toBe(3);
    expect(queryResponse.ipAddresses).toEqual(['3.3.3.3', '2.2.2.2', '1.1.1.1']);
  });

  it('Should return non existent stats for a missing link', async () => {
    expect.assertions(1);

    const exists: boolean = (await getStatisticsByURL('nonexistent.com')) as boolean;
    expect(exists).toBe(false);
  });

  it('Should delete links older than 1 year', async () => {
    expect.assertions(1);
    const now = new Date();
    const usedAt = now.setFullYear(now.getFullYear() - 2);
    const forgedLink: ILink = new Link({
      url: 'forgedDate.com',
      hash: 'forgedHash',
      ipAddress: '1.2.3.4',
      requested: 0,
      usedAt,
    });
    await forgedLink.save();

    // clean it up
    await removeOlderThan(1);

    // shouldn't exist anymore
    const exists: boolean = (await getLinkByHash('forgedHash')) as boolean;
    expect(exists).toBe(false);
  });
});
