import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import {
  adminRateLimitConfig,
  userRateLimitConfig,
  createAdminRateLimitConfig,
  defaultRateLimitConfig,
  signinRateLimitConfig,
  sensitiveRateLimitingForUsersConfig
} from '../configs/middleware.config';

const limitRateForUser = rateLimit(userRateLimitConfig);

export const limitRateForAdmin = rateLimit(adminRateLimitConfig);

export function limitRateByRole(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  try {
    if (req.user.role !== 'admin') {
      return limitRateForUser(req, res, next);
    }

    return limitRateForAdmin(req, res, next);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
}

export const limitCreateAdminRate = rateLimit(createAdminRateLimitConfig);

export const limitSigninRate = rateLimit(signinRateLimitConfig);

export const defaultLimitRate = rateLimit(defaultRateLimitConfig);

const rateLimitSensitiveActionForUsers = rateLimit(sensitiveRateLimitingForUsersConfig);

export function limitSensitiveAction(
  req: Request,
  res: Response,
  next: NextFunction
): any {
  try {
    if (req.user.role !== 'admin') {
      return rateLimitSensitiveActionForUsers(req, res, next);
    }

    return limitRateForAdmin(req, res, next);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
}