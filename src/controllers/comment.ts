import { RequestHandler } from "express";
import Comment from "../db/schema/comment";
import Notification from "../db/schema/notification";
import { findCommentById, findPaperById, findUserById } from "../db/utils";

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

    const paper = await findPaperById(paperId, res);
    if (!paper) {
      res.status(404).send({ code: 404, error: "해당 문서가 존재하지 않습니다." });
      return;
    }
    if (!paper.commenter.find((c) => c.toString() === id)) {
      paper.commenter.push(id);
      paper.save();
    }

    const commenter = await findUserById(id, res);
    const newComment = await Comment.create({ commenter, content, paper: paperId });
    if (recommentId) {
      const targetComment = await findCommentById(recommentId, res);
      await targetComment.populate({
        path: "recomment",
        model: "Comment",
        select: "commenter",
        populate: {
          path: "commenter",
          model: "User",
          select: "id",
        },
      });

      const notifiedTarget = new Set(targetComment.recomment.map((v) => v.commenter._id.toString()));
      for (const targetId of [...notifiedTarget]) {
        const notOriginCommenter = targetId !== targetComment.commenter.toString();
        if (notOriginCommenter) {
          await Notification.create({
            user: targetId,
            type: "recomment",
            paper: paperId,
            comment: newComment._id,
          });
        }
      }

      targetComment.recomment.push(newComment._id);
      targetComment.save();
      newComment.re = true;
      newComment.save();

      const notOriginCommenter = commenter.id !== targetComment.commenter.toString();
      if (notOriginCommenter) {
        await Notification.create({
          user: targetComment.commenter,
          type: "recomment",
          paper: paperId,
          comment: newComment._id,
        });
      }
    } else {
      const notWriter = commenter.id !== paper.writer._id.toString();
      if (notWriter) {
        await Notification.create({
          user: paper?.writer,
          type: "comment",
          paper: paperId,
          comment: newComment._id,
        });
      }
    }
    commenter.comment.push(newComment._id);
    commenter.save();

    res.status(201).send({ success: "댓글 작성이 완료되었습니다" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const putComment: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.accessToken;
    const { content, editId } = req.body;

    const comment = await findCommentById(editId, res);
    if (id !== comment.commenter.toString()) {
      return res.status(400).send({ code: 400, error: "자신의 댓글만 수정할 수 있습니다." });
    }

    comment.content = content;
    comment.save();

    res.send({ success: "댓글 수정 완료" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const deleteComment: RequestHandler = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const { id } = res.locals.accessToken;
    const { deleteId, originId } = req.body;

    const paper = await findPaperById(paperId, res);
    if (!paper) {
      res.status(404).send({ code: 404, error: "해당 문서가 존재하지 않습니다." });
      return;
    }
    const userComments = await Comment.find({ paper: paperId, commenter: id });
    if (!userComments.length) {
      paper.commenter.pull(id);
      paper.save();
    }

    const user = await findUserById(id, res);
    const deleteComment = await findCommentById(deleteId, res);

    if (user.id !== deleteComment.commenter.toString()) {
      return res.status(400).send({ code: 400, error: "자신의 댓글만 삭제할 수 있습니다." });
    }

    user.comment.pull(deleteId);
    await Comment.findByIdAndDelete(deleteId);

    if (originId) {
      const originComment = await findCommentById(originId, res);
      originComment.recomment.pull(deleteId);
      originComment.save();
    }

    res.send({ success: "댓글 삭제 완료" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
