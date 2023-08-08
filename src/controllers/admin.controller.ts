import { Request, Response } from 'express';
import userService from '../services/user.service';
import { verifyPassword } from '../utils/password.util';
import { generateToken } from '../utils/token.util';
import { client } from '../configs/exports.config';
import { IUser } from '../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';

class AdminController {
  async createAdmin(req: Request, res: Response) {
    // Checks admin secret
    if (req.body.adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({
        message: `You have entered a wrong admin secret, please try again.`,
        success: false,
      });
    }

    // Checks if the user already exists
    const existingUser = await userService.findOne({
      username: <string>req.user.username,
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
        message: `This username belongs to a disabled account.`,
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

    // Changes user role to administrator
    existingUser.role = 'admin';
    await existingUser.save();

    // Generates an access token
    const payload = existingUser.toObject();
    const token = await generateToken(payload);

    // Check if there's a valid refresh token in the cookies and creates a new one if there isn't
    const refreshToken = <string>req.cookies?.refreshToken || <string>uuidv4();
    const admin = JSON.stringify(existingUser.toObject());

    // Stores the refresh token in Redis and in the browser cookies
    client.setex(`refreshToken:${refreshToken}`, 604800, admin);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 604800000,
    });

    // Sets the new access token as an HTTP cookie in the response
    res.cookie('accessToken', token, { httpOnly: true, maxAge: 60000 });

    // Returning the user to the client side
    const {
      _id,
      fullname,
      username,
      avatar,
      email,
      phoneNumber,
      role,
      verified,
      deleted,
    }: IUser = existingUser.toObject();

    const loggedInAdmin = {
      _id,
      fullname,
      username,
      avatar,
      email,
      phoneNumber,
      role,
      verified,
      deleted,
    };

    console.log('Logged in Admin:', loggedInAdmin);

    return res.header('Authorization', `Bearer ${token}`).status(200).json({
      success: true,
      message: 'User role has been successfully changed to admin!',
      data: loggedInAdmin,
    });
  }
}

export default new AdminController();
