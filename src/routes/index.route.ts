import { Application, Request, Response } from 'express';
import authRouter from './auth.route';

import constants from '../configs/constants.config';

const apiVersion = constants.API_VERSION;

export default (app: Application) => {
  app.use(`${apiVersion}/health`, (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: 'App is working properly',
    });
  });
  app.use(`${apiVersion}/`, authRouter);
};
