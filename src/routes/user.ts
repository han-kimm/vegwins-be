import { Router } from "express";
import { getUserComment, getUserPaper, nicknameChange } from "../controllers/user";
import { verifyToken } from "../middlewares/jwt";

const userRouter = Router();

userRouter.put("/nickname", verifyToken, nicknameChange);

userRouter.get("/paper", verifyToken, getUserPaper);
userRouter.get("/comment", verifyToken, getUserComment);

export default userRouter;
