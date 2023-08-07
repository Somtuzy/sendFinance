import { Request, Response } from "express"
import  userService from "../services/user.service";
import { hashPassword, verifyPassword } from "../utils/password.util";
import { generateToken } from "../utils/token.util";
import generateRandomAvatar from "../utils/avatar.util";
import { client } from '../configs/exports.config'
import { IUser } from "../interfaces/user.interface";
import { v4 as uuidv4 } from 'uuid';

class AuthenticateController {
  async signup(req: Request, res: Response) {
      // Checks for existing user
      const existingUser = await userService.findOne({ username: req.body.username });

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

      // Hashes the user password
      const hashedPassword = await hashPassword(req.body.password);

      // Creates a new user
      const newUser = await userService.create({
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: hashedPassword,
        avatar: avatarUrl,
      });

      const payload = newUser.toObject()

      // Generates a token for the user
      const token = await generateToken(payload);

      // Saves the user
      await newUser.save();

      // Check if there's a valid refresh token in the HTTP cookie
      const refreshToken = uuidv4();

      // Store the refresh token in Redis with an expiration time (e.g., 7 days)
      client.setex(`refreshToken:${refreshToken}`, 604800, newUser._id);

      // Set the new access token as an HTTP cookie in the response
      res.cookie('refreshToken', token, { httpOnly: true, maxAge: 604800000 });

      // Returning the fields to the client side without the password
      const { _id, fullname, username, avatar, email, phoneNumber, role, verified, deleted }: IUser = newUser.toObject();
      const signedUpUser = { _id, fullname, username, avatar, email, phoneNumber, role, verified, deleted }

      console.log('Signed up User:', signedUpUser);

      // Retuns credentials to the client side
      return res
      .header("Authorization", `Bearer ${token}`)
      .status(200).json({
        success: true,
        message: "User signed up successfully!",
        data: signedUpUser
      });
  }

  async login(req: Request, res: Response) {
      // Checks if the user already exists
      const existingUser = await userService.findOne({ username: req.body.username });

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
        req.body.password as string,
        existingUser.password
      );

      // Sends a message if the input password doesn't match
      if (!isValidPassword) {
        return res.status(401).json({
          message: `Incorrect password, please retype your password`,
          success: false,
        });
      }

      // Stores the returned user's unique id in an object to generate a token for the user
      const token = await generateToken({
        _id: existingUser._id,
        fullname: existingUser.fullname,
      });

      // Check if there's a valid refresh token in the HTTP cookie and creates a new one if there isn't
      const refreshToken = <string>req.cookies?.refreshToken || <string>uuidv4()

      // Store the refresh token in Redis with an expiration time (e.g., 7 days)
      client.setex(`refreshToken:${refreshToken}`, 604800, existingUser._id);

      // Set the new access token as an HTTP cookie in the response
      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 604800000 });

      const { _id, fullname, username, avatar, email, phoneNumber, role, verified, deleted }: IUser = existingUser.toObject();
      const loggedInUser = { _id, fullname, username, avatar, email, phoneNumber, role, verified, deleted }
      
      console.log('Logged in User:', loggedInUser);

      // Retuns credentials to the client side
      return res
      .header("Authorization", `Bearer ${token}`)
      .status(200).json({
        success: true,
        message: "User logged in successfully!",
        data: loggedInUser
      });
  }
}

export default new AuthenticateController()