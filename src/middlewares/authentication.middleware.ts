import { Request, Response, NextFunction } from 'express';
import {
  verifyToken,
  checkTokenValidity,
  generateToken,
} from '../utils/token.util';
import userService from '../services/user.service';
import { JwtPayload } from 'jsonwebtoken';
import { client } from '../configs/exports.config';
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

    if (!accessToken) {
      return res.status(403).json({
        success: false,
        message: 'You must be signed in to continue',
      });
    }

    // Extracts the expiration date from the token available
    const isValidToken = await checkTokenValidity(accessToken);

    // Checks if the token is expired
    if (!isValidToken) {
      // If the access token is invalid, try to refresh it
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
        });
      }

      // Check if the refresh token exists in Redis
      const cachedUser = await client.get(`refreshToken:${refreshToken}`);
      const user: IUser = cachedUser ? await JSON.parse(cachedUser) : null;

      if (!user) {
        // If the refresh token is invalid, return 401 status code to the front-end
        return res.status(401).json({
          success: false,
          message: 'Session expired, sign in to continue',
        });
      }

      // Generate a new access token and send it to the user
      const newAccessToken = await generateToken(user);

      // Add the new access token to the response headers for the front-end to use
      res.setHeader('Authorization', newAccessToken);
    }

    // Check if the refresh token exists in Redis
    const cachedUser = await client.get(`refreshToken:${refreshToken}`);
    let user: IUser = cachedUser ? await JSON.parse(cachedUser) : null;

    if (!user) {
      // Decode the user token to get user credentials
      const decoded = await verifyToken(accessToken);

      // Searches for an existing user with the decoded credentials
      user = (await userService.findOne({
        _id: (decoded as JwtPayload)._id,
        deleted: false,
      })) as IUser;

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
    }

    console.log(`Authenticated User: 
    Fullname: ${user.fullname}
    Username: ${user.username}`);

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
