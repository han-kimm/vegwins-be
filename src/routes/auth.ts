import cors from "cors";
import { Router } from "express";
import { googleStrategy } from "../controllers/auth";
const authRouter = Router();

authRouter.use(
  cors({
    origin: ["http://localhost:3000", "https://vegwins.vercel.app"],
    credentials: true,
  })
);

authRouter.post("/google", googleStrategy);

export default authRouter;
