import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import validator from '../middlewares/validator.middleware';
import { LoginAdminSchema } from '../schemas/admin.schema';
import authenticate from '../middlewares/authentication.middleware';

const adminRouter = Router();

adminRouter.post(
  '/login-admin',
  authenticate,
  [validator(LoginAdminSchema)],
  adminController.createAdmin
);

export default adminRouter;
