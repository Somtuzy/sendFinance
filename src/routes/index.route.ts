import { Application } from 'express';
import userRouter from './user.route';
import authRouter from './auth.route';
import adminRouter from './admin.route';
import accountRouter from './account.route';
import transactionRouter from './transaction.route';
import { defaultLimitRate, limitSigninRate } from '../middlewares/ratelimit.middleware';

import constants from '../configs/constants.config';
import authenticate from '../middlewares/authentication.middleware';

const apiVersion = constants.API_VERSION;
const redirectToDocs = constants.REDIRECT_TO_DOCS
const checkHealth = constants.HEALTH_CHECK
const sayHi = constants.SAY_HI

export default (app: Application) => {
  app.use(`${apiVersion}/`, [defaultLimitRate], sayHi);
  app.use(`${apiVersion}/home`, [defaultLimitRate], sayHi);
  app.use(`${apiVersion}/health`, [defaultLimitRate], checkHealth);
  app.use(`${apiVersion}/users`, [authenticate], userRouter);
  app.use(`${apiVersion}/auth`, [limitSigninRate], authRouter);
  app.use(`${apiVersion}/admins`, [authenticate], adminRouter);
  app.use(`${apiVersion}/accounts`, [authenticate], accountRouter);
  app.use(`${apiVersion}/transactions`, [authenticate], transactionRouter);
  app.use(`${apiVersion}/docs`, redirectToDocs);
};
