import "express-async-errors"
import Redis from 'ioredis';
import { logger } from './configs/constants.config';
import app from './app';

const PORT = process.env.PORT || 3000;
const client = new Redis();

app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`);

  client.on('connection', () => {
    console.log('Redatabase connected succesfully');
  });
  
  client.on('error', (err: Error) => {
    console.log('Error connecting to the database', err);
  });
});
