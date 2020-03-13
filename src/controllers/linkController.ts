import { Query } from 'mongoose';
import shortid from 'shortid';

import Link from '../models/link.model';
import { ILink, ILinkStats, ILinkModel } from '../types';

/**
 * Adds a new link and returns a hash
 *
 * @param {string} url
 * @param {string} ipAddress IP address of the requester
 * @returns {Promise<ILink>}
 */
export const addLink = (url: string, ipAddress: string): Promise<ILink> => {
  const newLink: ILink = new Link({
    url,
    hash: shortid.generate(),
    ipAddress,
  });
  return newLink.save();
};

/**
 * Gets the corresponding link for a given {hash}
 *
 * @export
 * @param {string} hash
 * @returns {(Promise<ILink | boolean>)}
 */
export const getLinkByHash = async (hash: string): Promise<ILink | boolean> => {
  const link: ILink = await Link.findOne({ hash });
  if (!link) return false;
  link.requested += 1;
  link.usedAt = new Date();
  return link.save();
};

/**
 * Gets the statistics for the given {url}
 *
 * @export
 * @param {string} url
 * @returns {(Promise<ILinkStats | boolean>)}
 */
export const getStatisticsByURL = async (url: string): Promise<ILinkStats | boolean> => {
  const results = await (Link as ILinkModel).getStatistics(url);
  if (!results.length) return false;
  return results[0];
};

/**
 * Removes links that were't used in the past {years} years
 *
 * @export
 * @param {number} years
 * @returns {Query<any>}
 */
export const removeOlderThan = (years: number): Query<any> => {
  const now = new Date();
  const cutoffDate = now.setFullYear(now.getFullYear() - years);
  return Link.deleteMany({ usedAt: { $lt: cutoffDate } });
};
