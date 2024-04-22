import { Router } from "express";
import { canEdit, getOnePaper, getPaper, postPaper } from "../controllers/paper";
import { verifyToken } from "../middlewares/jwt";
import { getRating, updateRating } from "../controllers/rating";

const paperRouter = Router();

paperRouter.get("/", getPaper);
paperRouter.post("/", verifyToken, postPaper);

paperRouter.get("/:paperId", getOnePaper);

paperRouter.get("/:paperId/writer", verifyToken, canEdit);

paperRouter.get("/:paperId/rating", verifyToken, getRating);
paperRouter.post("/:paperId/rating", verifyToken, updateRating);

export default paperRouter;
