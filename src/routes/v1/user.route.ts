import { Router } from "express";
import authController from "../../controllers/v1/user.controller";
import validator from "../../middlewares/v1/validator.middleware";
import { SignUpUserSchema, LoginUserSchema } from "../../schemas/v1/user.schema";

const authRouter = Router();

authRouter.post("/login", [validator(LoginUserSchema)], authController.login);

authRouter.post("/signup", [validator(SignUpUserSchema)], authController.signup);

export default authRouter;