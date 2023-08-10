import { Router } from 'express';
import transactionController from '../controllers/transaction.controller';
import validator from '../middlewares/validator.middleware';
import {
  SendFundSchema,
  FundAccountSchema,
} from '../schemas/transaction.schema';
import adminAccess from '../middlewares/authorization.middleware';
import { limitRateForAdmin, limitSensitiveAction } from '../middlewares/ratelimit.middleware';

const transactionRouter = Router();

transactionRouter.post(
  '/sendfund',
  [limitSensitiveAction, validator(SendFundSchema)],
  transactionController.sendFunds
);

transactionRouter.post(
  '/addfund/:accountId',
  [limitSensitiveAction, validator(FundAccountSchema)],
  transactionController.addFunds
);

transactionRouter.get(
  '/',
  [limitRateForAdmin, adminAccess],
  transactionController.getTransactions
);

export default transactionRouter;
