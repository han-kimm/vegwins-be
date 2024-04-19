import { RequestHandler } from "express";
import User from "../db/schema/user";

export const hasRating: RequestHandler = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const { id: _id } = res.locals.accessToken;
    const data = { isWriter: res.locals.isWriter, rating: -1 };

    const user = await User.findOne({ _id });
    const ratings = user?.rating;
    if (!ratings) {
      res.send(data);
      return;
    }
    if ("id" in ratings) {
      const paperRating = ratings.id(paperId);
      data.rating = paperRating?.rating ?? -1;
      res.send(data);
      return;
    }
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const updateRating: RequestHandler = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const { rating } = req.body;
    const { id: _id } = res.locals.accessToken;
    const user = await User.findOne({ _id });
    user?.rating.push({ _id: paperId, rating });
    user?.save();

    res.send({ rating });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
