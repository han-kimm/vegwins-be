import { Router } from "express";
import paperRouter from "./paper";
import authRouter from "./auth";

const indexRouter = Router();

indexRouter.use("/paper", paperRouter);
indexRouter.use("/auth", authRouter);

export default indexRouter;
