import { Router } from "express";
import { getOnePaper, getPaper, postPaper } from "../controllers/paper";
import { verifyToken } from "../middlewares/jwt";

const paperRouter = Router();

paperRouter.get("/", getPaper);
paperRouter.get("/:paperId", getOnePaper);
paperRouter.post("/", verifyToken, postPaper);

export default paperRouter;
