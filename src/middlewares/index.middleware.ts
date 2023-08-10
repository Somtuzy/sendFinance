import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import asyncError from './errors.middleware';
import indexRoute from '../routes/index.route';
import { morganConfig, corsConfig } from '../configs/middleware.config';

import database from '../configs/db.config';
database();

export default (app: Application) => {
  app.use(morgan(morganConfig));
  app.use(cors(corsConfig));
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(asyncError);
  indexRoute(app);
};
