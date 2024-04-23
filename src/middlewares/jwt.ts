import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../db/schema/user";

const SECRET = process.env.JWT_SECRET || "";

type Params = Parameters<RequestHandler>;

export const checkRefreshToken: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.headers.authorization?.split(" ").at(-1);
    if (!refreshToken) {
      res.status(400).send({ code: 400, error: "잘못된 요청입니다." });
      return;
    }
    jwt.verify(refreshToken, SECRET, verifyCallback(res, next, 420));
  } catch (e) {
    console.error(e);
    next(e);
  }
};
export const updateToken: RequestHandler = async (req, res, next) => {
  try {
    const { id } = res.locals.accessToken;
    const user = await User.findOne({ _id: id });
    if (user) {
      const accessToken = setToken({ id }, "10m");
      const refreshToken = setToken({ id }, "1d");
      res.cookie("v_rt", refreshToken, { maxAge: 60 * 60 * 24 * 1000, secure: true, httpOnly: true, sameSite: "strict", path: "/api/refresh" });
      res.status(200).send({ accessToken });
      return;
    }
    res.status(400).send({ code: 400, error: "유효하지 않은 유저입니다." });
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const verifyToken: RequestHandler = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization?.split(" ").at(-1);
    if (!accessToken) {
      return res.status(401).send({ code: 401, error: "토큰이 존재하지 않습니다." });
    }
    jwt.verify(accessToken, SECRET, verifyCallback(res, next, 419));
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const setToken = (id: object, time?: string) => {
  const newToken = jwt.sign(id, process.env.JWT_SECRET ?? "vegwins", { expiresIn: time });
  return newToken;
};

const verifyCallback = (res: Params[1], next: Params[2], code: number) => (e: any, decoded: any) => {
  if (decoded) {
    res.locals.accessToken = decoded;
    return next();
  }

  if (e.name === "TokenExpiredError") {
    res.status(code).json({
      code: code,
      error: "토큰이 만료되었습니다.",
    });
    return;
  }
  res.status(401).json({
    code: 401,
    error: "유효하지 않은 토큰입니다.",
  });
  return;
};
