import { Router } from "express";
import { verifyToken } from "../middlewares/jwt";
import Paper from "../db/schema/paper";
import User from "../db/schema/user";

const paperRouter = Router();

paperRouter.use(verifyToken);

paperRouter.get("/", async (req, res, next) => {
  try {
    const papers = await Paper.find({});

    res.send({ data: papers });
    return;
  } catch (e) {
    console.error(e);
    next(e);
  }
});

paperRouter.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const { sub } = res.locals.decoded;
    const newPaper = await Paper.create({ ...req.body, writer: sub });
    console.log(JSON.stringify(newPaper));
    res.status(201).send({ paperId: newPaper.id });
    return;
  } catch (e) {
    console.error(e);
    next(e);
  }

  res.status(400).send({ code: 400, error: "값이 유효하지 않습니다." });
});

export default paperRouter;
