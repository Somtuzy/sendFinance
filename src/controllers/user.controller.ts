import { Request, Response } from 'express';
import userService from '../services/user.service';
import { hashPassword, verifyPassword } from '../utils/password.util';
import { generateToken } from '../utils/token.util';
import generateRandomAvatar from '../utils/avatar.util';
import redisClient from '../configs/redis.config';
import { IUser } from '../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';

class AuthenticateController {
  async signup(req: Request, res: Response) {
    try {
      // Checks for existing user
      const existingUser = await userService.findOne({
        email: req.body.email,
      });

      if (existingUser && existingUser.deleted === true) {
        return res.status(403).json({
          message: `This email belongs to a disabled account.`,
          success: false,
        });
      }

      if (existingUser && existingUser.email === req.body.email) {
        return res.status(403).json({
          message: `Oops, it seems like this email is taken. Try a different email or sign in if you're the one registered with this email`,
          success: false,
        });
      }

      // Generates a random avatar for the user
      const avatarUrl = await generateRandomAvatar(req.body.email);

      // Hashes the given password
      const hashedPassword = await hashPassword(req.body.password);

      // Creates a new user
      const newUser = await userService.create({
        fullname: <string>req.body.fullname,
        email: <string>req.body.email,
        phoneNumber: <string>req.body.phoneNumber,
        password: hashedPassword,
        avatar: avatarUrl,
      });

      // Generates an access token
      const payload = newUser.toObject();
      const token = await generateToken(payload);

      // Saves the user
      await newUser.save();

      // Generates a refresh token
      const refreshToken = uuidv4();
      const user = JSON.stringify(newUser.toObject());

      // Store the refresh token in Redis and in the browser cookies for subsequent requests
      redisClient.setex(`refreshToken:${refreshToken}`, 604800, user);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 604800000,
      });

      // Set the new access token as an HTTP cookie in the response
      res.cookie('accessToken', token, { httpOnly: true, maxAge: 60000 });

      // Returning the fields to the client side without the password
      const data: IUser = newUser.toObject()
      data.password = ''
      
      console.log('Signed up User:', data);

      // Returns credentials to the client side
      return res.header('Authorization', `Bearer ${token}`).status(200).json({
        success: true,
        message: 'User signed up successfully!',
        data: data,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      // Checks if the user already exists
      const existingUser = await userService.findOne({
        email: <string>req.body.email,
      });

      // Returns a message if user doesn't exist
      if (!existingUser) {
        return res.status(404).json({
          message: `User does not exist, would you like to sign up instead?`,
          success: false,
        });
      }

      if (existingUser && existingUser.deleted === true) {
        return res.status(403).json({
          message: `This email belongs to a disabled account.`,
          success: false,
        });
      }

      // Checks if the password input by the client matches the protected password of the returned user
      const isValidPassword = await verifyPassword(
        <string>req.body.password,
        existingUser.password
      );

      // Sends a message if the input password doesn't match
      if (!isValidPassword) {
        return res.status(401).json({
          message: `Incorrect password, please retype your password`,
          success: false,
        });
      }

      // Generates an access token
      const payload = existingUser.toObject();
      const token = await generateToken(payload);

      // Check if there's a valid refresh token in the cookies and creates a new one if there isn't
      const refreshToken =
        <string>req.cookies?.refreshToken || <string>uuidv4();
      const user = JSON.stringify(existingUser.toObject());

      // Stores the refresh token in Redis and in the browser cookies
      redisClient.setex(`refreshToken:${refreshToken}`, 604800, user);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 604800000,
      });

      // Sets the new access token as an HTTP cookie in the response
      res.cookie('accessToken', token, { httpOnly: true, maxAge: 60000 });

      // Returning the user to the client side
      const data: IUser = existingUser.toObject();
      data.password = ''

      console.log('Logged in User:', data);

      return res.header('Authorization', `Bearer ${token}`).status(200).json({
        success: true,
        message: 'User logged in successfully!',
        data: data,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  }

  // Getting all users
  async getUsers(req: Request, res: Response) {
    try {
      const cachedUsers = await JSON.parse(
        <string>await redisClient.get('users')
      );

      if (cachedUsers) {
        // Sends a success message and displays transactions
        return res.status(200).json({
          success: true,
          message: `Users fetched successfully!`,
          data: cachedUsers,
        });
      }

      const users = await userService.findAll({ deleted: false });

      // Sends a message if no users exist
      if (!users)
        return res.status(404).json({
          success: false,
          message: `Oops, it seems like there are no users yet`
        });

      // Saves the fetched transactions to the cache
      await redisClient.setex('users', 10, JSON.stringify(users));

      // Sends a success message and displays users
      return res.status(200).json({
        success: true,
        message: `Users fetched successfully!`,
        data: users,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
}

export default new AuthenticateController();
