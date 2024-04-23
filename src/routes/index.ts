import { Router } from "express";
import paperRouter from "./paper";
import authRouter from "./auth";
import cors from "cors";

const indexRouter = Router();

indexRouter.use(
  cors({
    origin: ["http://localhost:3000", "https://vegwins.vercel.app"],
    credentials: true,
  })
);

indexRouter.get("/", (_, res) => {
  return res.send({ success: "어서오세요, vwsapi 서버입니다." });
});

indexRouter.use("/auth", authRouter);
indexRouter.use("/paper", paperRouter);

export default indexRouter;
