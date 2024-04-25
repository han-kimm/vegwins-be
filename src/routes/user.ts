import { Router } from "express";
import { getUserPaper, nicknameChange } from "../controllers/user";
import { verifyToken } from "../middlewares/jwt";

const userRouter = Router();

userRouter.put("/nickname", verifyToken, nicknameChange);

userRouter.get("/paper", verifyToken, getUserPaper);

export default userRouter;
