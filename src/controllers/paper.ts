import { RequestHandler } from "express";
import { HydratedDocument } from "mongoose";
import Paper, { IPaper } from "../db/schema/paper";
import User from "../db/schema/user";

export const getPaper: RequestHandler = async (req, res, next) => {
  try {
    const c = req.query.c;
    const k = req.query.k as string;

    let papers: HydratedDocument<IPaper>[];
    if (c && k) {
      papers = await Paper.find({ ...makeKeywordQuery(k), category: c }).select("title end imageUrl hashtag rating view");
    } else if (c) {
      papers = await Paper.find({ category: c }).select("title end imageUrl hashtag rating view").sort({ createdAt: -1 });
    } else if (k) {
      papers = await Paper.find({ ...makeKeywordQuery(k) }).select("title end imageUrl hashtag rating view");
    } else {
      papers = await Paper.find({}).select("title end imageUrl hashtag rating view").sort({ rated: -1 });
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

    const writer = await User.findOne({ _id: id });
    if (!writer) {
      res.status(400).send({ code: 400, error: "해당 유저가 존재하지 않습니다." });
      return;
    }
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
    const { paperId: _id } = req.params;
    const paper = await Paper.findOne({ _id });
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
