import { Request, Response } from 'express';
import transactionService from '../services/transaction.service';
import userService from '../services/user.service';
import accountService from '../services/account.service';
import isValidObjectId from '../utils/id.util';
import client from '../configs/redis.config';
import { verifyPin } from '../utils/password.util';
import { ICreateTransaction } from '../interfaces/transaction.interface';

class AccountController {
  async sendFunds(req: Request, res: Response) {
    try {
      const { amount, pin } = req.body;

      const requestUser = await userService.findOne({ _id: req.user._id });
      if (!requestUser) {
        return res.status(404).json({
          success: false,
          message: 'Sender was not found',
        });
      }

      const senderTag = `$${<string>req.body.senderTag}`;
      const senderAccount = await accountService.findOne({
        uniqueTag: senderTag,
      });

      if (!senderAccount) {
        return res.status(404).json({
          success: false,
          message: 'Sender account not found',
        });
      }

      if (senderAccount.userId.toString() !== requestUser._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'You have input an incorrect unique tag, please try again',
        });
      }

      if (requestUser._id.toString() !== senderAccount.userId.toString()) {
        return res.status(403).json({
          success: false,
          message:
            'You cannot transfer from an account that doesnt belong to you',
        });
      }

      const receiverTag = `$${<string>req.body.receiverTag}`;
      const recipientAccount = await accountService.findOne({
        uniqueTag: receiverTag,
      });

      if (!recipientAccount) {
        return res.status(404).json({
          success: false,
          message: 'Recipient account not found',
        });
      }

      const isValidPin = await verifyPin(pin, senderAccount.pin);
      if (!isValidPin) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect pin',
        });
      }

      if (senderAccount.balance < amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient funds',
        });
      }

      // Update sender's balance
      senderAccount.balance -= amount;
      await senderAccount.save();

      // Update recipient's balance
      recipientAccount.balance += amount;
      await recipientAccount.save();

      const transaction: ICreateTransaction = {
        sender: req.user._id,
        senderTag: senderAccount.uniqueTag,
        amount: amount,
        receiver: recipientAccount._id,
        receiverTag: recipientAccount.uniqueTag,
      }

      // Create a new transaction with 'success' status
      const newTransaction = await transactionService.create(transaction);

      await newTransaction.save();

      if (
        newTransaction &&
        newTransaction._id &&
        newTransaction.status === 'pending'
      ) {
        newTransaction.status = 'successful';
        await newTransaction.save();
      }

      const updatedSenderAccount = await accountService.findOne({
        uniqueTag: senderTag,
      });

      return res.status(201).json({
        success: true,
        message: `You have successfully sent ${amount} to ${recipientAccount.uniqueTag}!`,
        data: {
          transactionDetails: newTransaction,
          accountDetails: updatedSenderAccount,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  }

  // Simulating making a deposit just so we can test the transfers
  async addFunds(req: Request, res: Response) {
    try {
      const { amount, pin } = req.body;

      if (!isValidObjectId(req.params.accountId)) {
        return res.status(403).json({
          success: false,
          message: 'Invalid account id',
        });
      }

      const accountOwner = await userService.findOne({ _id: req.user._id });

      if (!accountOwner) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const isExistingAccount = await accountService.findOne({
        _id: req.params.accountId,
      });

      if (!isExistingAccount) {
        return res.status(404).json({
          success: false,
          message: 'This account doesnt exist',
        });
      }

      if (accountOwner._id.toString() !== isExistingAccount.userId.toString()) {
        return res.status(400).json({
          success: false,
          message: 'You cannot fund an account that does not belong to you',
        });
      }

      const isValidPin = await verifyPin(pin, isExistingAccount.pin);
      if (!isValidPin) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect pin',
        });
      }

      const newBalance = isExistingAccount.balance + <number>amount;

      const fundedAccount = await accountService.updateOne(
        isExistingAccount._id,
        { balance: newBalance }
      );

      const transaction: ICreateTransaction = {
        sender: req.user._id,
        senderTag: isExistingAccount.uniqueTag,
        amount: amount,
        receiver: req.user._id,
        receiverTag: isExistingAccount.uniqueTag,
      }

      // Create a new transaction with 'success' status
      const newTransaction = await transactionService.create(transaction);

      await newTransaction.save();

      if (
        newTransaction &&
        newTransaction._id &&
        newTransaction.status === 'pending'
      ) {
        newTransaction.status = 'successful';
        await newTransaction.save();
      }

      return res.status(200).json({
        success: true,
        message: `Your account ${fundedAccount?.uniqueTag} has been successfully funded with ${amount}!`,
        data: {
          transactionDetails: newTransaction,
          accountDetails: fundedAccount,
        },
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }
  }

  // Getting all transactions
  async getTransactions(req: Request, res: Response) {
    try {
      const cachedTransactions = await JSON.parse(
        <string>await client.get('transactions')
      );

      if (cachedTransactions) {
        // Sends a success message and displays transactions
        return res.status(200).json({
          success: true,
          message: `Transactions fetched successfully!`,
          data: cachedTransactions,
        });
      }

      const transactions = await transactionService.findAll({});

      // Sends a message if no transactions exist
      if (!transactions)
        return res.status(404).json({
          success: false,
          message: `Oops, it seems like there are no transactions yet`,
        });

      // Saves the fetched transactions to the cache
      await client.setex('transactions', 10, JSON.stringify(transactions));

      // Sends a success message and displays transactions
      return res.status(200).json({
        success: true,
        message: `Transactions fetched successfully!`,
        data: transactions,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

export default new AccountController();
