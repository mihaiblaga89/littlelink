import mongoose from 'mongoose';

class DB {
  static async init(mongoUri: string): Promise<void> {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
  }

  static async teardown() {
    await mongoose.disconnect();
  }
}

export default DB;
