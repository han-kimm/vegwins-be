import { RequestHandler } from "express";
import { findUserById } from "../db/utils";

export const postComment: RequestHandler = async (req, res, next) => {
  const { id } = res.locals.accessToken;
  const { content } = req.body;
  if (!content) {
    res.status(400).send({ code: 400, error: "댓글 내용을 입력해 주세요." });
    return;
  }

  const writer = await findUserById(id, res);
};
