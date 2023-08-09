import { Application } from 'express';
import userRouter from './user.route';
import adminRouter from './admin.route';
import accountRouter from './account.route';
import transactionRouter from './transaction.route';

import constants from '../../configs/constants.config';

const apiVersion = constants.API_VERSION_V1;

export default (app: Application) => {
  app.use(`${apiVersion}/health`, constants.HEALTH_CHECK);
  app.use(`${apiVersion}/`, userRouter);
  app.use(`${apiVersion}/`, adminRouter);
  app.use(`${apiVersion}/`, accountRouter);
  app.use(`${apiVersion}/`, transactionRouter);
};