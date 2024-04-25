import { Router } from "express";
import { googleStrategy } from "../controllers/auth";
import { checkRefreshToken, updateToken } from "../middlewares/jwt";
const authRouter = Router();

authRouter.post("/google", googleStrategy);
authRouter.get("/refresh", checkRefreshToken, updateToken);

export default authRouter;
