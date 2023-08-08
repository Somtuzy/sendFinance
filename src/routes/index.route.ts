import { Application, Request, Response } from 'express';
import userRouter from './user.route';
import adminRouter from './admin.route';
import { CreateAdminRateLimit } from '../configs/middleware.config';

import constants from '../configs/constants.config';

const apiVersion = constants.API_VERSION;

export default (app: Application) => {
  app.use(`${apiVersion}/health`, (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: 'App is working properly',
    });
  });
  app.use(`${apiVersion}/`, userRouter);
  app.use(`${apiVersion}/`, CreateAdminRateLimit, adminRouter);
};