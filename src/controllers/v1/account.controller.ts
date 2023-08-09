import { Request, Response } from 'express';
import accountService from '../../services/v1/account.service';
import userService from '../../services/v1/user.service';
import isValidObjectId from '../../utils/id.util';

class AccountController {
  async createAccount(req: Request, res: Response) {
    
    if (!isValidObjectId(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid object id',
      });
    }

    const accountOwner = await userService.findOne({ _id: req.user._id });

    if (!accountOwner) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (accountOwner.account) {
      return res.status(403).json({
        success: false,
        message: 'You already have an account',
      });
    }

    const uniqueTag = '$' + req.body.uniqueTag
    
    const existingAccount = await accountService.findOne({
      uniqueTag: uniqueTag
    });

    if (existingAccount) {
      return res.status(403).json({
        success: false,
        message: 'This unique account tag is already assigned to a user',
      });
    }

    const newAccount = await accountService.create({
      userId: accountOwner._id,
      uniqueTag: uniqueTag,
    });

    await newAccount.save();

    await userService.updateOne(accountOwner._id, {account: newAccount._id})

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: newAccount,
    });
  }
}

export default new AccountController();
