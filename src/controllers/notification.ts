import { RequestHandler } from "express";
import Notification from "../db/schema/notification";

export const getNotification: RequestHandler = async (_, res, next) => {
  try {
    const { id } = res.locals.accessToken;
    const notifications = await Notification.find({ user: id })
      .select("paper comment type createdAt")
      .populate("paper", "title")
      .populate("comment", "content")
      .sort({ createdAt: -1 });

    res.send(notifications);
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const deleteNotification: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.accessToken;
    const { deleteId, all } = req.body;

    if (all) {
      await Notification.deleteMany({ user: id });
      return res.send({ message: "모두 삭제 완료" });
    }

    await Notification.findByIdAndDelete(deleteId);
    return res.send({ message: "모두 삭제 완료" });
  } catch (e) {
    console.error(e);
    next(e);
  }
};
