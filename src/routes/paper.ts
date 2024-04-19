import { Router } from "express";
import { canEdit, getOnePaper, getPaper, postPaper } from "../controllers/paper";
import { verifyToken } from "../middlewares/jwt";
import { hasRating, updateRating } from "../controllers/rating";

const paperRouter = Router();

paperRouter.get("/", getPaper);
paperRouter.get("/:paperId", getOnePaper);
paperRouter.get("/:paperId/user", verifyToken, canEdit, hasRating);
paperRouter.post("/", verifyToken, postPaper);
paperRouter.post("/:paperId/user", verifyToken, updateRating);

export default paperRouter;
