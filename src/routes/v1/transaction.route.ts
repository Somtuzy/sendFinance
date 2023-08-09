import { Router } from 'express';
import transactionController from '../../controllers/v1/transaction.controller';
import validator from '../../middlewares/v1/validator.middleware';
import {
  CreateTransactionSchema,
  FundAccountSchema,
} from '../../schemas/v1/transaction.schema';
import authenticate from '../../middlewares/v1/authentication.middleware';

const transactionRouter = Router();

transactionRouter.post(
  '/transfer/:accountId',
  authenticate,
  [validator(CreateTransactionSchema)],
  transactionController.sendFunds
);

transactionRouter.post(
  '/deposit/:accountId',
  authenticate,
  [validator(FundAccountSchema)],
  transactionController.fundAccount
);

export default transactionRouter;
