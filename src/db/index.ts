import mongoose from 'mongoose';
/**
 * Mongo database class
 *
 * @class DB
 */
class DB {
  /**
   * Bootstraps the Mongo connection
   *
   * @static
   * @param {string} mongoUri
   * @returns {Promise<void>}
   * @memberof DB
   */
  static async init(mongoUri: string): Promise<void> {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
  }

  /**
   * Terminates the connection
   *
   * @static
   * @memberof DB
   */
  static async teardown() {
    await mongoose.disconnect();
  }
}

export default DB;
