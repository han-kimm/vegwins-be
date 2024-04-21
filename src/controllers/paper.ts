import { RequestHandler } from "express";
import { HydratedDocument } from "mongoose";
import Paper, { IPaper } from "../db/schema/paper";

export const getPaper: RequestHandler = async (req, res, next) => {
  try {
    const { c, k } = req.query;
    const REG = /#[a-z0-9_가-힣]+/;
    const path = REG.test(k as string) ? "hashtag" : "title";

    let papers: HydratedDocument<IPaper>[];
    if (c && k) {
      papers = await Paper.aggregate()
        .search({
          index: "paper_title_search",
          text: {
            query: k,
            path,
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
            path,
          },
        })
        .project({ title: 1, end: 1, imageUrl: 1, hashtag: 1 });
    } else {
      papers = await Paper.find({}).select("title end imageUrl hashtag").sort({ rated: -1 });
    }
    res.send(papers);
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

    res.send(paper);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const postPaper: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.accessToken;
    const newPaper = await Paper.create({ ...req.body, writer: id });
    res.status(201).send({ paperId: newPaper.id });
    return;
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const canEdit: RequestHandler = async (req, res, next) => {
  try {
    const { id: userId } = res.locals.accessToken;
    const { paperId: _id } = req.params;
    const paper = await Paper.findOne({ _id });
    res.locals.isWriter = userId === paper?.writer._id.toString();
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
};
