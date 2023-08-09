import express from 'express';
import indexMiddleware from './middlewares/v1/index.middleware';

const app = express();

indexMiddleware(app);

export default app;
