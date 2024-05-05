import { RequestHandler } from "express";
import Carousel from "../db/schema/carousel";

export const getCarousel: RequestHandler = async (req, res, next) => {
  try {
    const carousels = await Carousel.find({});
    res.send(carousels);
  } catch (e) {
    console.error(e);
    next(e);
  }
};
