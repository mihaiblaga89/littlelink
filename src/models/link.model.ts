import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ILink extends Document {
  url: String;
  hash: Array<String>;
  ipAddress: Array<String>;
  requested: Number;
  createdAt: Date;
}

const LinkSchema: Schema = new Schema({
  url: { type: String, required: true },
  hash: { type: String, required: true },
  ipAddress: { type: [String], required: true },
  requested: { type: [String], required: false, default: 0 },
  createdAt: { type: Date, required: false, default: Date.now },
});

export const Link: Model<ILink> = mongoose.model<ILink>('Link', LinkSchema);
