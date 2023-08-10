import {Request, Response} from 'express'
import pino from "pino";

const logger = pino()

export default {
  API_VERSION: '/api/v1',
  HEALTH_CHECK: (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: 'App is working properly',
    });
  },
  LOGGER: logger,
  REDIRECT_TO_DOCS: (req: Request, res: Response) => {
    res.redirect(301, <string>process.env.DOCS_URL)
  }
}