import { Router } from "express";
import userController from "../controllers/user.controller";
import adminAccess from "../middlewares/authorization.middleware";
import { limitRateForAdmin } from "../middlewares/ratelimit.middleware";

const userRouter = Router();

userRouter.get("/", [limitRateForAdmin, adminAccess], userController.getUsers);

export default userRouter;