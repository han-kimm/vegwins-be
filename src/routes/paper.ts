import { Router } from "express";
import { deleteComment, getComment, postComment, putComment } from "../controllers/comment";
import { canEdit, deletePaper, getEditPaper, getOnePaper, getPaper, postPaper, putPaper } from "../controllers/paper";
import { deleteRating, getRating, updateRating } from "../controllers/rating";
import { verifyToken } from "../middlewares/jwt";
import multer from "multer";
import s3Storage from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { resizeImage } from "../middlewares/image";

export const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_ACCESS_SECRET || "",
  },
  region: "ap-northeast-2",
});

const upload = multer({
  storage: s3Storage({
    s3,
    bucket: "vegwins",
    key(req, file, callback) {
      callback(null, `${Date.now()}_${file.originalname}`);
    },
  }),
  limits: { fieldSize: 3 * 1024 * 1024 },
});

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
