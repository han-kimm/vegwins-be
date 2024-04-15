import { Router } from "express";
import paper from "../db/schema/paper";

const paperRouter = Router();

paperRouter.get("/", async (req, res, next) => {
  try {
    const newPaper = await paper.create({
      title: "테스트1",
      category: ["서점"],
      description: "우와",
      writer: "1",
    });

    console.log(JSON.stringify(newPaper));

    res.status(201).send({ paperId: newPaper.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export default paperRouter;
