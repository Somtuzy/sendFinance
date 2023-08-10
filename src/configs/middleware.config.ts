import { CorsOptions } from "cors"

/* Configuration for morgan */
export const morganConfig = `:date[iso] :method :url :status :response-time ms :remote-addr :http-version :referrer :user-agent`

/* Configuration for cors */
export const corsConfig: CorsOptions = {
  origin: '*',
  exposedHeaders: ['Authorization', 'Access-Token']
}

/* Configuration for rate limiter */
// Limit rate to 10 requests per minute for users
export const userRateLimitConfig = {
  windowMs: 1000 * 60,
  max: 20,
  message: {
    error: 'You have made too many requests, please try again later.',
  },
};

// Limit rate to 30 requests per minute for admins
export const adminRateLimitConfig = {
  windowMs: 1000 * 60,
  max: 40,
  message: {
    error: 'You have made too many admin requests, please try again later.',
  },
};

// Limit rate to 15 requests per half hour for creating admins
export const createAdminRateLimitConfig = {
  windowMs: 1000 * 60 * 30,
  max: 15,
  message: {
    error: 'You have tried to create an admin too many times, please try again in a minute.',
  },
};

// Limit rate to 10 requests per minute for signing in
export const signinRateLimitConfig = {
  windowMs: 1000 * 60,
  max: 10,
  message: {
    error: 'You have tried to sign in too many times, please try again in a minute.',
  },
};

// Limit rate to 100 requests per hour by default for unprotected routes
export const defaultRateLimitConfig = {
  windowMs: 1000 * 60 * 60,
  max: 100,
  message: {
    error: 'You have made too many requests, please try again later.',
  },
};

// Limit rate to 50 requests per hour for performing sensitive actions
export const sensitiveRateLimitingForUsersConfig = {
  windowMs: 1000 * 60 * 60,
  max: 50,
  message: {
    error: 'You have made too many requests to a protected route, please try again later.',
  },
};