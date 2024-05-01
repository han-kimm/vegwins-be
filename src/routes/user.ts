import { Router } from "express";
import { deleteNotification, getNotification } from "../controllers/notification";
import { getUserComment, getUserPaper, getUserRating, nicknameChange } from "../controllers/user";
import { verifyToken } from "../middlewares/jwt";

const userRouter = Router();

userRouter.put("/nickname", verifyToken, nicknameChange);

userRouter.get("/paper", verifyToken, getUserPaper);
userRouter.get("/comment", verifyToken, getUserComment);
userRouter.get("/rating", verifyToken, getUserRating);
userRouter.get("/notification", verifyToken, getNotification);
userRouter.delete("/notification", verifyToken, deleteNotification);

export default userRouter;
