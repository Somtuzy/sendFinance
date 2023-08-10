import mongoose from 'mongoose';
import constants from './constants.config';

const logger = constants.LOGGER

export default (function database() {
  const startdb = () => {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(<string>process.env.MONGODB_URI, {
        dbName: 'sendFinance',
      })
      .then(() => {
        logger.info('Successfully connected to zha database...');
      })
      .catch((err) => {
        logger.error('There was an error connecting to zha database:', err);
        logger.info('Reconnecting to database...');
        startdb();
      });
  };

  startdb();
});
