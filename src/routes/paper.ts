import { Router } from "express";
import { verifyToken } from "../middlewares/jwt";

const paperRouter = Router();

paperRouter.use(verifyToken);

paperRouter.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    // const newPaper = await paper.create(req.body);
    // console.log(JSON.stringify(newPaper));
    // res.status(201).send({ paperId: newPaper.id });
  } catch (e) {
    console.error(e);
    next(e);
  }

  res.status(400).send({ error: "" });
});

export default paperRouter;
