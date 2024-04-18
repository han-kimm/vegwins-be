import { RequestHandler } from "express";
import Paper, { IPaper } from "../db/schema/paper";
import { HydratedDocument } from "mongoose";
import User from "../db/schema/user";

export const getPaper: RequestHandler = async (req, res, next) => {
  try {
    const { c, k } = req.query;

    let papers: HydratedDocument<IPaper>[];
    if (c && k) {
      papers = await Paper.aggregate()
        .search({
          index: "paper_title_search",
          text: {
            query: k,
            path: "title",
          },
        })
        .match({ category: c })
        .project({ title: 1, end: 1, imageUrl: 1, hashtag: 1 });
      // papers.map((paper) => Paper.hydrate(paper));
    } else if (c) {
      papers = await Paper.find({ category: c }).select("title end imageUrl hashtag").sort({ createdAt: -1 });
    } else if (k) {
      papers = await Paper.aggregate()
        .search({
          index: "paper_title_search",
          text: {
            query: k,
            path: "title",
          },
        })
        .project({ title: 1, end: 1, imageUrl: 1, hashtag: 1 });
    } else {
      papers = await Paper.find({}).select("title end imageUrl hashtag").sort({ rated: -1 });
    }
    res.send({ data: papers });
    return;
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getOnePaper: RequestHandler = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const paper = await Paper.findOne({ _id: paperId }).populate("writer", "nickname");
    if (!paper) {
      res.status(404).send({ code: 404, error: "해당 문서가 존재하지 않습니다." });
      return;
    }
    paper.view++;
    paper.save();

    const data = paper.toObject({ virtuals: true });

    const token = res.locals.decoded;
    if (token) {
      const { id } = token;
      data.isWriter = id === paper.writer.id;
    }

    res.send(data);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const postPaper: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.decoded;
    const newPaper = await Paper.create({ ...req.body, writer: id });
    res.status(201).send({ paperId: newPaper.id });
    return;
  } catch (e) {
    console.error(e);
    next(e);
  }
};
