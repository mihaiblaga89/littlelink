import { Document, Model } from 'mongoose';

export interface ILink extends Document {
  url: string;
  hash: string;
  ipAddress: string;
  requested: number;
  createdAt: Date;
  usedAt: Date;
}

export interface ILinkModel extends Model<ILink> {
  getStatistics: (url: string) => Promise<ILinkStats[]>;
}

export interface ILinkStats {
  url: string;
  hashes: string[];
  ipAddresses: string[];
  requests: number;
}

export interface IHashInput {
  url: string;
}
