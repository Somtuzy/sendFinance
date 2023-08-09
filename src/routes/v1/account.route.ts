import { Router } from 'express';
import accountController from '../../controllers/v1/account.controller';
import validator from '../../middlewares/v1/validator.middleware';
import { CreateAccountSchema } from '../../schemas/v1/account.schema';
import authenticate from '../../middlewares/v1/authentication.middleware';

const accountRouter = Router();

accountRouter.post('/accounts', authenticate, [validator(CreateAccountSchema)], accountController.createAccount);

export default accountRouter;
