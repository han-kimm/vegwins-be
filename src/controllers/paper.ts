import { RequestHandler } from "express";
import { HydratedDocument } from "mongoose";
import Paper, { IPaper } from "../db/schema/paper";
import { findPaperById, findUserById } from "../db/utils";
import Notification from "../db/schema/notification";

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
      papers = await Paper.find({ ...(k ? makeKeywordQuery(k) : {}), rated: { $gt: 67 } })
        .select("title end imageUrl hashtag rated rating.length")
        .sort({ rated: -1 });
    } else if (c && k) {
      papers = await Paper.find({ ...makeKeywordQuery(k), category: c }).select("title end imageUrl hashtag rated rating.length");
    } else if (c) {
      papers = await Paper.find({ category: c }).select("title end imageUrl hashtag rated rating.length");
    } else if (k) {
      papers = await Paper.find({ ...makeKeywordQuery(k) }).select("title end imageUrl hashtag rated rating.length");
    } else {
      papers = await Paper.find({}).select("title end imageUrl hashtag rated rating.length").sort({ createdAt: -1 });
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

    if (paper.view === 100) {
      await Notification.create({ user: paper?.writer, type: "view", paper });
    }

    res.send(paper);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const postPaper: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.accessToken;
    const noImageData = JSON.parse(req.body.data);
    const file = req.file as Express.MulterS3.File;
    let newPaper;
    if (file) {
      const { location } = file;
      newPaper = await Paper.create({ ...noImageData, imageUrl: location, writer: id });
    } else if (!file) {
      newPaper = await Paper.create({ ...noImageData, writer: id });
    }

    const writer = await findUserById(id, res);
    writer.paper.push(newPaper!._id);
    writer.save();

    res.status(201).send({ paperId: newPaper!.id });
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
    res.send(isWriter);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const makeKeywordQuery = (k: string) => {
  const REG = /#[a-z0-9_가-힣]+/;
  return REG.test(k) ? { hashtag: k } : { $text: { $search: k } };
};
