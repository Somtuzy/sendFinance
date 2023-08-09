import { Request, Response, NextFunction } from 'express';
import { logger } from '../../configs/exports.config';

export default (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(error);

  return res.status(500).json({
    success: false,
    message: error.message,
  });
};