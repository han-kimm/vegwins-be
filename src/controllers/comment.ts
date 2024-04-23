import { RequestHandler } from "express";
import Comment from "../db/schema/comment";
import { findCommentById, findUserById } from "../db/utils";

export const getComment: RequestHandler = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const comments = await Comment.find({ paper: paperId, re: false })
      .select("commenter content recomment createdAt")
      .populate("commenter", "nickname")
      .populate({
        path: "recomment",
        model: "Comment",
        select: "commenter content createdAt",
        populate: {
          path: "commenter",
          model: "User",
          select: "nickname",
        },
      });

    res.send(comments);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const postComment: RequestHandler = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const { id } = res.locals.accessToken;
    const { content, recommentId } = req.body;
    if (!content) {
      res.status(400).send({ code: 400, error: "댓글 내용을 입력해 주세요." });
      return;
    }

    const commenter = await findUserById(id, res);

    const newComment = await Comment.create({ commenter, content, paper: paperId });
    if (recommentId) {
      const targetComment = await findCommentById(recommentId, res);
      targetComment.recomment.push(newComment._id);
      targetComment.save();
      newComment.re = true;
      newComment.save();
    }

    commenter.comment.push(newComment._id);
    commenter.save();

    res.status(201).send({ success: "댓글 작성이 완료되었습니다" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
