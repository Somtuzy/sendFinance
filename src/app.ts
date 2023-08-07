import express from "express";
import startDb from "./configs/db.config"
import indexMiddleware from "./middlewares/index.middleware";

const app = express();

indexMiddleware(app)
startDb()

export default app;