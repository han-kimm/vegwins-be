import { Router } from "express";
import { googleStrategy } from "../controllers/auth";
const authRouter = Router();

authRouter.post("/google", googleStrategy);

export default authRouter;
