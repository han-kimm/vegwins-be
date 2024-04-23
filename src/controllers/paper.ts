import { RequestHandler } from "express";
import { HydratedDocument } from "mongoose";
import Paper, { IPaper } from "../db/schema/paper";
import { findPaperById, findUserById } from "../db/utils";

export const getPaper: RequestHandler = async (req, res, next) => {
  try {
    const c = req.query.c;
    const k = req.query.k as string;

    let papers: HydratedDocument<IPaper>[];
    if (c === "주간 조회수") {
      papers = await Paper.find({ ...(k ? makeKeywordQuery(k) : {}) })
        .sort({ view: -1 })
        .select("title end imageUrl hashtag view");
    } else if (c === "좋은 평가") {
      papers = await Paper.find({ ...(k ? makeKeywordQuery(k) : {}) }).select("title end imageUrl hashtag rated");
      console.log(papers);
    } else if (c && k) {
      papers = await Paper.find({ ...makeKeywordQuery(k), category: c }).select("title end imageUrl hashtag rated");
    } else if (c) {
      papers = await Paper.find({ category: c }).select("title end imageUrl hashtag rated").sort({ createdAt: -1 });
    } else if (k) {
      papers = await Paper.find({ ...makeKeywordQuery(k) }).select("title end imageUrl hashtag rated");
    } else {
      papers = await Paper.find({}).select("title end imageUrl hashtag rated rating.length");
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
    const paper = await findPaperById(paperId, res);
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

    const writer = await findUserById(id, res);
    writer.paper.push(newPaper._id);
    writer.save();

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
    const { paperId } = req.params;
    const paper = await findPaperById(paperId, res);
    const isWriter = userId === paper?.writer._id.toString();
    res.send({ isWriter });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const makeKeywordQuery = (k: string) => {
  const REG = /#[a-z0-9_가-힣]+/;
  return REG.test(k) ? { hashtag: k } : { $text: { $search: k } };
};
