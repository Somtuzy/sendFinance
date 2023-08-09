import { Request, Response } from 'express';
import transactionService from '../../services/v1/transaction.service';
import userService from '../../services/v1/user.service';
import accountService from '../../services/v1/account.service';
import isValidObjectId from '../../utils/id.util';

class AccountController {
  async sendFunds(req: Request, res: Response) {
    if (!isValidObjectId(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid request user id',
      });
    }

    if (!isValidObjectId(req.params.accountId)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid account id',
      });
    }

    const { senderTag, receiverTag, amount } = req.body;

    const requestUser = await userService.findOne({_id: req.user._id});

    if(!requestUser) {
      return res.status(404).json({
        success: false,
        message: 'Sender was not found'
      })
    }

    const senderAccount = await accountService.findOne({_id: req.params.accountId});
    const recipientAccount = await accountService.findOne({uniqueTag: '$' + receiverTag});

    if (!senderAccount) {
      return res.status(404).json({ 
        success: false,
        message: 'Sender account not found' 
      });
    }
    
    if(requestUser._id.toString() !== senderAccount.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot transfer from an account that doesnt belong to you'
      })
    }
    
    if (!recipientAccount) {
      return res.status(404).json({ 
        success: false,
        message: 'Recipient account not found' 
      });
    }

    if (senderAccount.uniqueTag.toString() !== `$${senderTag}`) {
      return res.status(400).json({ 
        success: false,
        message: 'You have input an incorrect unique tag, please try again' 
      });
    }

    if (senderAccount.balance < amount) {
      return res.status(400).json({ 
        success: false,
        message: 'Insufficient funds' 
      });}

    // Update sender's balance
    senderAccount.balance -= amount;
    await senderAccount.save();

    // Update recipient's balance
    recipientAccount.balance += amount;
    await recipientAccount.save();

    // Create a new transaction with 'success' status
    const newTransaction = await transactionService.create({
      sender: req.user._id,
      senderTag: senderAccount.uniqueTag,
      amount: amount,
      receiver: recipientAccount._id,
      receiverTag: recipientAccount.uniqueTag,
    });

    await newTransaction.save();

    if(newTransaction && newTransaction._id && newTransaction.status === 'pending') {
      newTransaction.status = 'successful'
      await newTransaction.save()
    }

    const updatedSenderAccount = await accountService.findOne({_id: req.params.accountId});

    return res.status(201).json({
      success: true,
      message: `You have successfully sent ${amount} to ${recipientAccount.uniqueTag}!`,
      data: {
        transactionDetails: newTransaction,
        accountDetails: updatedSenderAccount
      }
    });
  }

  // Simulating making a deposit just so we can test the transfers
  async fundAccount(req: Request, res: Response) {
    if (!isValidObjectId(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Invalid request user id',
      });
    }

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

    const uniqueTag = '$' + req.body.uniqueTag
    const accountWithTag = await accountService.findOne({uniqueTag: uniqueTag})
    const accountWithId = await accountService.findOne({_id: req.params.accountId})
   
    if(!accountWithTag || !accountWithId) {
      return res.status(404).json({
        success: false,
        message: 'This account doesnt exist',
      });
    }

    if (accountOwner._id.toString() !== accountWithId.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'This account does not belong to you',
      });
    }
console.log(accountWithTag._id.toString(), accountWithId._id.toString());

    if(accountWithTag._id.toString() !== accountWithId._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'This tag does not match your account',
      });
    }

    const newBalance = accountWithId.balance + <number>req.body.amount
    console.log('check us out:', accountWithId.balance, newBalance);

    const fundedAccount = await accountService.updateOne(req.params.accountId,
      {balance: newBalance});

    // Create a new transaction with 'success' status
    const newTransaction = await transactionService.create({
      sender: req.user._id,
      senderTag: accountWithId.uniqueTag,
      amount: req.body.amount,
      receiver: req.user._id,
      receiverTag: accountWithId.uniqueTag,
    });

    await newTransaction.save();

    if(newTransaction && newTransaction._id && newTransaction.status === 'pending') {
      newTransaction.status = 'successful'
      await newTransaction.save()
    }

    return res.status(200).json({
      success: true,
      message: `Your account ${fundedAccount?.uniqueTag} has been successfully funded with ${req.body.amount}!`,
      data: {
        transactionDetails: newTransaction, 
        accountDetails: fundedAccount
      },
    });
  }
}

export default new AccountController();
