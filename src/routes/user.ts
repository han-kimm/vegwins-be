import { Router } from "express";
import { nicknameChange } from "../controllers/user";
import { verifyToken } from "../middlewares/jwt";

const userRouter = Router();

userRouter.put("/nickname", verifyToken, nicknameChange);

export default userRouter;
