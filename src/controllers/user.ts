import { RequestHandler } from "express";
import { findUserByIdAndUpdate } from "../db/utils";
import User from "../db/schema/user";
import Paper from "../db/schema/paper";

export const nicknameChange: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.accessToken;
    const { newNickname } = req.body;
    if (!newNickname) {
      return res.status(400).send({ code: 400, error: "유효하지 않은 값입니다." });
    }
    const isTakenNickname = await User.findOne({ nickname: newNickname });
    if (isTakenNickname) {
      return res.status(400).send({ code: 400, error: "이미 사용 중인 닉네임입니다." });
    }
    const user = await findUserByIdAndUpdate(id, { nickname: newNickname }, res);
    res.send({ nickname: newNickname });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const getUserPaper: RequestHandler = async (_, res, next) => {
  try {
    const { id } = res.locals.accessToken;

    const userPapers = await Paper.find({ writer: id }).select("title end imageUrl hashtag rated rating.length").sort({ createdAt: -1 });
    res.send(userPapers);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
