import { RequestHandler } from "express";
import User from "../db/schema/user";
import Paper from "../db/schema/paper";

export const getRating: RequestHandler = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const { id: _id } = res.locals.accessToken;
    const data = { isWriter: res.locals.isWriter, rating: -1 };

    const user = await User.findOne({ _id });
    const ratings = user?.rating;
    if (!ratings?.length) {
      res.send(data);
      return;
    }
    const paperRating = ratings.id(paperId);
    data.rating = paperRating?.rating ?? -1;
    res.send(data);
    return;
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const updateRating: RequestHandler = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const rating = req.body.rating as 0 | 1 | 2;

    const paper = await Paper.findOne({ _id: paperId });
    if (!paper) {
      res.status(400).send({ code: 400, error: "해당 문서가 존재하지 않습니다." });
      return;
    }

    const previousRating = paper.rating;
    if (!previousRating) {
      paper.rating = { [rating]: 1, length: 1 };
    } else {
      paper.rating = { ...previousRating, [rating]: (previousRating[rating] ?? 0) + 1, length: (previousRating.length ?? 0) + 1 };
    }
    paper.save();

    const { id: _id } = res.locals.accessToken;
    const user = await User.findOne({ _id });
    if (!user) {
      res.status(400).send({ code: 400, error: "해당 유저가 존재하지 않습니다." });
      return;
    }

    const userRating = user.rating;
    const previoustRating = userRating.id(paperId);
    if (previoustRating) {
      userRating.pull(paperId);
    }
    userRating.push({ _id: paperId, rating });
    user.save();

    res.send({ rating });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const deleteRating: RequestHandler = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const rating = req.body.rating as 0 | 1 | 2;

    const paper = await Paper.findOne({ _id: paperId });
    if (!paper) {
      res.status(400).send({ code: 400, error: "해당 문서가 존재하지 않습니다." });
      return;
    }

    const previousRating = paper.rating;
    if (previousRating) {
      paper.rating = { ...previousRating, [rating]: previousRating[rating]! - 1, length: previousRating.length! - 1 };
    }
    paper.save();

    const { id: _id } = res.locals.accessToken;
    const user = await User.findOne({ _id });
    if (!user) {
      res.status(400).send({ code: 400, error: "해당 유저가 존재하지 않습니다." });
      return;
    }
    const userRating = user.rating;
    const previoustRating = userRating.id(paperId);
    if (previoustRating) {
      userRating.pull(paperId);
    }
    user.save();

    res.send({ rating: -1 });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
