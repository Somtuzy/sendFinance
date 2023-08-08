import rateLimit from 'express-rate-limit';
import { CorsOptions } from "cors"

// Apply rate limiting middleware with a limit of 5 requests per minute for regular users
export const userRateLimit = rateLimit({
  windowMs: 60000,
  max: 5,
  message: {
    error: 'You have made too many requests, please try again later.',
  },
});

// Apply rate limiting middleware with a limit of 10 requests per minute for admins
export const adminRateLimit = rateLimit({
  windowMs: 60000,
  max: 10,
  message: {
    error: 'You have made too many requests, please try again later.',
  },
});

// / Apply rate limiting middleware with a limit of 3 requests per hour for admins
export const CreateAdminRateLimit = rateLimit({
  windowMs: 60000 * 60,
  max: 3,
  message: {
    error: 'You have made too many requests, please try again later.',
  },
});

export const morganConfig = `:date[iso] :method :url :status :response-time ms :remote-addr :http-version :referrer :user-agent`

export const corsConfig: CorsOptions = {
  origin: '*',
  exposedHeaders: ['Authorization', 'Access-Token']
}