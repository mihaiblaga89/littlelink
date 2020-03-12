import moment from 'moment';
import { Query } from 'mongoose';
import shortid from 'shortid';

import Link from '../models/link.model';
import { ILink, ILinkStats } from '../types';

export const addLink = (url: string, ipAddress: string): Promise<ILink> => {
  const newLink: ILink = new Link({
    url,
    hash: shortid.generate(),
    ipAddress,
  });
  return newLink.save();
};

export const getLinkByHash = async (hash: string): Promise<ILink | boolean> => {
  const link: ILink = await Link.findOne({ hash });
  if (!link) return false;
  link.requested += 1;
  return link.save();
};

export const getStatisticsByURL = async (url: string): Promise<ILinkStats | boolean> => {
  const links: ILink[] = await Link.find({ url });

  if (!links.length) return false;

  const stats: ILinkStats = {
    url,
    hashes: [],
    ipAddresses: [],
    requests: 0,
  };

  links.forEach(link => {
    const { hash, ipAddress, requested } = link;

    // hashes are unique, can be pushed without checking
    stats.hashes.push(hash);

    if (!stats.ipAddresses.includes(ipAddress)) {
      stats.ipAddresses.push(ipAddress);
    }

    stats.requests += requested;
  });

  return <ILinkStats>stats;
};

export const removeOlderThan = (duration: moment.MomentInputObject): Query<any> => {
  const cutoffDate: Date = moment()
    .subtract(duration)
    .toDate();
  return Link.deleteMany({ createdAt: { $lt: cutoffDate } });
};
