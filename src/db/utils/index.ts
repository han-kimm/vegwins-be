import e, { Response } from "express";
import User from "../schema/user";
import Paper from "../schema/paper";

export const findUserById = async (id: string, res: Response) => {
  const writer = (await User.findOne({ _id: id }))!;
  if (!writer) {
    res.status(400).send({ code: 400, error: "해당 유저가 존재하지 않습니다." });
  }
  return writer;
};

export const findPaperById = async (id: string, res: Response) => {
  const paper = (await Paper.findOne({ _id: id }).populate("writer", "nickname"))!;
  if (!paper) {
    res.status(404).send({ code: 404, error: "해당 문서가 존재하지 않습니다." });
  }
  return paper;
};
