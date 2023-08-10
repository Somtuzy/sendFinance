import 'express-async-errors';
import app from './app';
import redisClient from './configs/redis.config';
import constants from './configs/constants.config';

const logger = constants.LOGGER

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`);

  redisClient.on('connection', () => {
    console.log('Redatabase connected succesfully');
  });

  redisClient.on('error', (err: Error) => {
    console.log('Error connecting to the database', err);
  });
});
