import { Router } from "express";
import authController from "../controllers/user.controller";
import validator from "../middlewares/validator.middleware";
import { SignUpUserSchema, LoginUserSchema } from "../schemas/user.schema";

const authRouter = Router();

authRouter.post("/login", [validator(LoginUserSchema)], authController.login);

authRouter.post("/signup", [validator(SignUpUserSchema)], authController.signup);

export default authRouter;
