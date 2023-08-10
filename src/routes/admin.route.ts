import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import validator from '../middlewares/validator.middleware';
import { LoginAdminSchema } from '../schemas/admin.schema';
import { limitCreateAdminRate } from '../middlewares/ratelimit.middleware';

const adminRouter = Router();

adminRouter.post(
  '/create-admin',
  [limitCreateAdminRate, validator(LoginAdminSchema)],
  adminController.createAdmin
);

export default adminRouter;
