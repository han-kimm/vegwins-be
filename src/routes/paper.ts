import { Router } from "express";
import { deleteComment, getComment, postComment, putComment } from "../controllers/comment";
import { canEdit, deletePaper, getEditPaper, getOnePaper, getPaper, postPaper, putPaper } from "../controllers/paper";
import { deleteRating, getRating, updateRating } from "../controllers/rating";
import { resizeImage, upload } from "../middlewares/image";
import { verifyToken } from "../middlewares/jwt";

const paperRouter = Router();

paperRouter.get("/", getPaper);
paperRouter.post("/", verifyToken, upload.single("image"), resizeImage, postPaper);

paperRouter.get("/:paperId", getOnePaper);
paperRouter.get("/:paperId/edit", getEditPaper);
paperRouter.put("/:paperId", verifyToken, upload.single("image"), resizeImage, putPaper);
paperRouter.delete("/:paperId", verifyToken, deletePaper);

paperRouter.get("/:paperId/writer", verifyToken, canEdit);

paperRouter.get("/:paperId/rating", verifyToken, getRating);
paperRouter.post("/:paperId/rating", verifyToken, updateRating);
paperRouter.delete("/:paperId/rating", verifyToken, deleteRating);

paperRouter.get("/:paperId/comment", getComment);
paperRouter.post("/:paperId/comment", verifyToken, postComment);
paperRouter.put("/:paperId/comment", verifyToken, putComment);
paperRouter.delete("/:paperId/comment", verifyToken, deleteComment);

export default paperRouter;
