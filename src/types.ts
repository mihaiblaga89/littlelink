import { Document } from 'mongoose';

export interface ILink extends Document {
  url: string;
  hash: string;
  ipAddress: string;
  requested: number;
  createdAt: Date;
}

export interface ILinkStats {
  url: string;
  hashes: string[];
  ipAddresses: string[];
  requests: number;
}
