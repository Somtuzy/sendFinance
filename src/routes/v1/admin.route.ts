import { Router } from 'express';
import adminController from '../../controllers/v1/admin.controller';
import validator from '../../middlewares/v1/validator.middleware';
import { LoginAdminSchema } from '../../schemas/v1/admin.schema';
import authenticate from '../../middlewares/v1/authentication.middleware';
import { CreateAdminRateLimit } from '../../configs/middleware.config';

const adminRouter = Router();

adminRouter.post(
  '/create-admin',
  authenticate,
  CreateAdminRateLimit, 
  [validator(LoginAdminSchema)],
  adminController.createAdmin
);

export default adminRouter;
