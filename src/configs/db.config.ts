import mongoose from 'mongoose';
import { logger } from './constants.config';

export default (function database() {
  const startdb = () => {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(<string>process.env.MONGODB_URI, {
        dbName: 'sendFinance',
      })
      .then(() => {
        logger.info('Database connection successful...');
      })
      .catch((err) => {
        logger.error('Error connecting to the database:', err);
        logger.info('Reconnecting to database...');
        startdb();
      });
  };

  startdb();
});
