import { Application, Request, Response } from 'express';
import { basePath } from '../configs/constants.config';

export default (app: Application) => {
  app.use(`${basePath}/`, (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: 'App is working properly',
    });
  });
};
