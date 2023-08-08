import "express-async-errors"
import app from './app';
import { client, logger } from './configs/exports.config'

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`);

  client.on('connection', () => {
    console.log('Redatabase connected succesfully');
  });
  
  client.on('error', (err: Error) => {
    console.log('Error connecting to the database', err);
  });
});