import { Router } from "express";
import { getOnePaper, getPaper, postPaper } from "../controllers/paper";
import { isToken, verifyToken } from "../middlewares/jwt";

const paperRouter = Router();

paperRouter.get("/", getPaper);
paperRouter.get("/:paperId", isToken, getOnePaper);
paperRouter.post("/", verifyToken, postPaper);

export default paperRouter;
