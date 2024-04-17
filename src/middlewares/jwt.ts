import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const verifyToken: RequestHandler = (req, res, next) => {
  try {
  } catch (e) {}
};

export const setToken = (id: object, time?: string) => {
  const newToken = jwt.sign(id, process.env.JWT_SECRET ?? "vegwins", { expiresIn: time });
  return newToken;
};
