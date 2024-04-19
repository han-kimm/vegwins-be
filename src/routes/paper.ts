import { Router } from "express";
import { canEdit, getOnePaper, getPaper, hasRating, postPaper } from "../controllers/paper";
import { isToken, verifyToken } from "../middlewares/jwt";

const paperRouter = Router();

paperRouter.get("/", getPaper);
paperRouter.get("/:paperId/user", verifyToken, canEdit, hasRating);
paperRouter.get("/:paperId", getOnePaper);
paperRouter.post("/", verifyToken, postPaper);

export default paperRouter;
