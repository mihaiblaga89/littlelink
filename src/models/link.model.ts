import mongoose, { Schema, Model } from 'mongoose';

import { ILink, ILinkStats } from '../types';

// eslint-disable-next-line import/no-mutable-exports
let LinkModel: Model<ILink>;

// Serverless offline can trigger OverwriteModelError. Using --useSeparateProcesses arg breaks vscode debugger
if (mongoose.models.Link) {
  LinkModel = mongoose.models.Link;
} else {
  const LinkSchema: Schema = new Schema({
    url: { type: String, required: true },
    hash: { type: String, required: true, unique: true, dropDups: true },
    ipAddress: { type: String, required: true },
    requested: { type: Number, required: false, default: 0 },
    createdAt: { type: Date, required: false, default: Date.now },
    usedAt: { type: Date, required: false },
  });

  LinkSchema.statics = {
    async getStatistics(url: string): Promise<ILinkStats[]> {
      return this.aggregate([
        { $match: { url } },
        {
          $group: {
            _id: null,
            url: { $first: '$url' },
            hashes: { $addToSet: '$hash' },
            ipAddresses: { $addToSet: '$ipAddress' },
            requests: { $sum: '$requested' },
          },
        },
      ]);
    },
  };

  LinkModel = mongoose.model('Link', LinkSchema);
}

export default LinkModel;
