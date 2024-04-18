import { Router } from "express";
import { getPaper, postPaper } from "../controllers/paper";
import { verifyToken } from "../middlewares/jwt";

const paperRouter = Router();

paperRouter.get("/", getPaper);
paperRouter.post("/", verifyToken, postPaper);

export default paperRouter;
