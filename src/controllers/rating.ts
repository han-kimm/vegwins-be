import { RequestHandler } from "express";
import { findPaperById, findUserById } from "../db/utils";
import Notification from "../db/schema/notification";

export const getRating: RequestHandler = async (req, res, next) => {
  try {
    const { paperId } = req.params;
    const { id: userId } = res.locals.accessToken;
    const data = { isWriter: res.locals.isWriter, rating: -1 };

    const user = await findUserById(userId, res);
    const ratings = user.rating;
    if (!ratings.length) {
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
    const { id: userId } = res.locals.accessToken;

    const user = await findUserById(userId, res);
    const userRating = user.rating;
    const userPreviousRating = userRating.id(paperId);
    if (userPreviousRating) {
      userRating.pull(paperId);
    }
    userRating.push({ _id: paperId, rating });
    user.save();

    const paper = await findPaperById(paperId, res);

    const previousRating = paper.rating;
    if (!previousRating.length) {
      paper.rating = { [rating]: 1, length: 1 };
    } else if (!userPreviousRating) {
      paper.rating = { ...previousRating, [rating]: (previousRating[rating] ?? 0) + 1, length: previousRating.length + 1 };
    } else if (userPreviousRating) {
      const deleteRating = userPreviousRating.rating as 0 | 1 | 2;
      paper.rating = { ...previousRating, [rating]: (previousRating[rating] ?? 0) + 1, [deleteRating]: previousRating[deleteRating]! - 1 };
    }
    paper.save();

    if (paper.rating.length === 10) {
      await Notification.create({ user: paper?.writer, type: "rating", paper });
    }

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

    const paper = await findPaperById(paperId, res);
    const previousRating = paper.rating;
    if (previousRating.length) {
      paper.rating = { ...previousRating, [rating]: previousRating[rating]! - 1, length: previousRating.length! - 1 };
      paper.save();
    }

    const { id: userId } = res.locals.accessToken;
    const user = await findUserById(userId, res);
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
