import { Router } from 'express';
import accountController from '../controllers/account.controller';
import validator from '../middlewares/validator.middleware';
import { CreateAccountSchema } from '../schemas/account.schema';
import { limitSensitiveAction } from '../middlewares/ratelimit.middleware';

const accountRouter = Router();

accountRouter.post(
  '/create-account',
  [limitSensitiveAction, validator(CreateAccountSchema)],
  accountController.createAccount
);

export default accountRouter;
