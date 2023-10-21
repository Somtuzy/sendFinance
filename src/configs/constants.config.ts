import {Request, Response} from 'express'
import pino from "pino";

const logger = pino()

export default {
  API_VERSION: '/api/v1',
  LOGGER: logger,
  HEALTH_CHECK: (req: Request, res: Response) => {
    return res.sendStatus(200)
  },
  SAY_HI: (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: 'Welcome to Send Finance, visit https://sendfinance.onrender.com/api/v1/auth/signup to sign up and start sending and receiving funds right away!',
    });
  },
  REDIRECT_TO_DOCS: (req: Request, res: Response) => {
    res.redirect(301, <string>process.env.DOCS_URL)
  }
}
