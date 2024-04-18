import { Router } from "express";
import { googleStrategy } from "../controllers/auth";
import { updateToken } from "../middlewares/jwt";
const authRouter = Router();

authRouter.post("/refresh", updateToken);
authRouter.post("/google", googleStrategy);

export default authRouter;
