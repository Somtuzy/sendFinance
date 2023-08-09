import {Request, Response} from 'express'

export default {
  API_VERSION_V1: '/api/v1',
  API_VERSION_V2: '/api/v2',
  HEALTH_CHECK: (req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: 'App is working properly',
    });
  },
}