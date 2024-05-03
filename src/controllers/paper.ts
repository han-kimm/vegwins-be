import { RequestHandler } from "express";
import { HydratedDocument } from "mongoose";
import Paper, { IPaper } from "../db/schema/paper";
import { findPaperById, findUserById } from "../db/utils";
import Notification from "../db/schema/notification";
import Comment from "../db/schema/comment";
import User from "../db/schema/user";
import { deleteS3Image } from "../middlewares/image";

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
    if (!paper) {
      res.status(404).send({ code: 404, error: "해당 문서가 존재하지 않습니다." });
      return;
    }
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
  const file = req.file as Express.MulterS3.File;
  try {
    const { id } = res.locals.accessToken;
    const noImageData = JSON.parse(req.body.data);
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
    if (file) {
      await deleteS3Image(file.location);
    }
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

export const getEditPaper: RequestHandler = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const paper = await Paper.findById(paperId).select("imageUrl title category hashtag description");
    res.send(paper);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const putPaper: RequestHandler = async (req, res, next) => {
  const file = req.file as Express.MulterS3.File;
  try {
    const { paperId } = req.params;
    const paper = await Paper.findById(paperId).select("imageUrl");
    const noImageData = JSON.parse(req.body.data);
    const deleteImage = JSON.parse(req.body.deleteImage);

    if (file) {
      await deleteS3Image(paper?.imageUrl);
      const { location } = file;
      await Paper.findByIdAndUpdate(paperId, { ...noImageData, imageUrl: location });
    } else if (!file && deleteImage) {
      await deleteS3Image(paper?.imageUrl);
      await Paper.findByIdAndUpdate(paperId, { ...noImageData, imageUrl: "" });
    } else {
      await Paper.findByIdAndUpdate(paperId, { ...noImageData });
    }

    res.status(200).send({ paperId });
  } catch (e) {
    if (file) {
      await deleteS3Image(file.location);
    }
    console.error(e);
    next(e);
  }
};

export const deletePaper: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.accessToken;
    const { paperId } = req.params;

    const paper = await findPaperById(paperId, res);
    if (!paper) {
      res.status(404).send({ code: 404, error: "해당 문서가 존재하지 않습니다." });
      return;
    }

    if (paper.writer._id.toString() !== id) {
      return res.status(400).send({ code: 400, error: "자신의 문서만 삭제할 수 있습니다." });
    }

    const writer = await findUserById(paper.writer._id.toString(), res);
    writer.paper.pull(paperId);

    const commenters = await User.find({ _id: paper.commenter }).select("comment notification");
    const comments = (await Comment.find({ paper: paperId }).select("id")).map((v) => v._id);
    const notifications = (await Notification.find({ paper: paperId }).select("id")).map((v) => v._id);
    commenters.map(
      (commenter) => (
        commenter.comment.filter((v) => comments.includes(v._id)),
        commenter.notification.filter((v) => !notifications.includes(v._id)),
        commenter.save()
      )
    );
    const raters = await User.find({ _id: paper.rater }).select("rating");
    raters.map((rater) => (rater.rating.pull(paperId), rater.save()));

    await deleteS3Image(paper.imageUrl);
    await Paper.findByIdAndDelete(paperId);
    await Comment.deleteMany({ paper: paperId });
    await Notification.deleteMany({ paper: paperId });

    res.send({ success: "문서 삭제 완료" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
