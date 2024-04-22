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
    console.log("paperRating", paperRating);
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
    const { rating } = req.body;

    await Paper.updateOne({ _id: paperId }, { [rating[rating]]: rating[rating] + 1 });

    const { id: _id } = res.locals.accessToken;
    const user = await User.findOne({ _id });
    const userRating = user?.rating;
    const previoustRating = userRating?.id(paperId);
    if (previoustRating) {
      userRating?.pull(paperId);
    }
    userRating?.push({ _id: paperId, rating });
    user?.save();

    res.send({ rating });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
