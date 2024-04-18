import { Router } from "express";
import Paper from "../db/schema/paper";
import { verifyToken } from "../middlewares/jwt";

const paperRouter = Router();

paperRouter.get("/", async (req, res, next) => {
  try {
    const papers = await Paper.find({}).sort({ createdAt: -1 });

    res.send({ data: papers });
    return;
  } catch (e) {
    console.error(e);
    next(e);
  }
});

paperRouter.post("/", verifyToken, async (req, res, next) => {
  try {
    const { sub } = res.locals.decoded;
    const newPaper = await Paper.create({ ...req.body, writer: sub });
    res.status(201).send({ paperId: newPaper.id });
    return;
  } catch (e) {
    console.error(e);
    next(e);
  }

  res.status(400).send({ code: 400, error: "값이 유효하지 않습니다." });
});

export default paperRouter;
