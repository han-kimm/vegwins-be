import { Router } from "express";
import paper from "../db/schema/paper";

const paperRouter = Router();

paperRouter.post("/", async (req, res, next) => {
  try {
    const newPaper = await paper.create(req.body);

    console.log(JSON.stringify(newPaper));

    res.status(201).send({ paperId: newPaper.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export default paperRouter;
