import { Router } from "express";
import Paper, { IPaper } from "../db/schema/paper";
import { verifyToken } from "../middlewares/jwt";
import { HydratedDocument } from "mongoose";

const paperRouter = Router();

paperRouter.get("/", async (req, res, next) => {
  try {
    const { c, k } = req.query;

    let papers: HydratedDocument<IPaper>[];
    if (c && k) {
      papers = await Paper.find({ category: c, title: k as string }).sort({ createdAt: -1 });
    } else if (c) {
      papers = await Paper.find({ category: c }).sort({ createdAt: -1 });
    } else if (k) {
      console.log(k);
      papers = await Paper.aggregate().search({
        index: "paper_title_search",
        text: {
          query: k,
          path: "title",
        },
      });
    } else {
      papers = await Paper.find({}).select("title end imageUrl hashtag").sort({ createdAt: -1 });
    }

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
