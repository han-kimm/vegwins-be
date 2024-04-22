import { Router } from "express";
import { googleStrategy } from "../controllers/auth";
import { checkRefreshToken, updateToken } from "../middlewares/jwt";
const authRouter = Router();

authRouter.get("/refresh", checkRefreshToken, updateToken);
authRouter.post("/google", googleStrategy);

export default authRouter;
