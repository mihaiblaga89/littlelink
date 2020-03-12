import mongoose, { Schema } from 'mongoose';

import { ILink } from '../types';

const LinkSchema: Schema = new Schema({
  url: { type: String, required: true },
  hash: { type: String, required: true, unique: true, dropDups: true },
  ipAddress: { type: String, required: true },
  requested: { type: Number, required: false, default: 0 },
  createdAt: { type: Date, required: false, default: Date.now },
});

export default mongoose.model<ILink>('Link', LinkSchema);
