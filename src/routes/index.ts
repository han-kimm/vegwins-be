import { Router } from "express";
import paperRouter from "./paper";
import authRouter from "./auth";
import cors from "cors";
import userRouter from "./user";
import { getCarousel } from "../controllers/carousel";
import codeRouter from "./code";

const indexRouter = Router();

indexRouter.use(
  cors({
    origin: ["http://localhost:3000", "https://vegwins.com", "*"],
    credentials: true,
  })
);

indexRouter.get("/", (_, res) => {
  return res.send({ success: "어서오세요, vwsapi 서버입니다." });
});
indexRouter.get("/carousel", getCarousel);

indexRouter.use("/auth", authRouter);
indexRouter.use("/paper", paperRouter);
indexRouter.use("/user", userRouter);

indexRouter.use("/code", codeRouter);

export default indexRouter;
