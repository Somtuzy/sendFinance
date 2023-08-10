import { Request, Response, NextFunction } from 'express';
import {
  verifyToken,
  checkTokenValidity,
  generateToken,
} from '../utils/token.util';
import userService from '../services/user.service';
import { JwtPayload } from 'jsonwebtoken';
import client from '../configs/redis.config';
import { IUser } from '../interfaces/user.interface';

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const authHeaders = req?.header('Authorization');
    const accessToken: string =
      authHeaders && authHeaders.substring(0, 7) === 'Bearer '
        ? authHeaders.replace('Bearer ', '')
        : req?.cookies?.accessToken;

    const refreshToken = req?.cookies?.refreshToken;

    if (!accessToken || !refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'You must be signed in to continue',
      });
    }

    // Extracts the expiration date from the token available
    const isValidToken = await checkTokenValidity(accessToken);
    const retrieveCachedUser = <string>await client.get(`refreshToken:${refreshToken}`);
    const cachedUser: IUser = await JSON.parse(<string>retrieveCachedUser);

    // Checks if the token is expired and if the access token is expired, try to refresh it
    if (!isValidToken) {
      if (!cachedUser) {
        // If there is no refresh token or it is expired, ask the user to sign in again
        return res.status(401).json({
          success: false,
          message: 'Session expired, sign in to continue',
        });
      }

      // Generates a new access token
      const newAccessToken = await generateToken(cachedUser);

      // Add the new access token to the response headers for the front-end to update
      res.setHeader('Authorization', newAccessToken);
    }

    // Decode the user token to get user credentials
    const decoded = await verifyToken(accessToken);

    // Searches for an existing user with the decoded credentials
    const user = await userService.findOne({
      _id: (decoded as JwtPayload)._id,
      deleted: false,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    console.log(`Authenticated User: 
    Fullname: ${user.fullname}
    User Id: ${user._id}`);

    // The user is then added to the request
    req.user = user;

    next();
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default authenticate;
