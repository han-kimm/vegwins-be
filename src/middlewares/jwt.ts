import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../db/schema/user";

const SECRET = process.env.JWT_SECRET || "";

type Params = Parameters<RequestHandler>;

export const isToken: RequestHandler = async (req, res, next) => {
  const cookie = req.cookies["v_at"];
  if (!cookie) {
    return next();
  }
  jwt.verify(cookie, SECRET, (e: any, decoded: any) => {
    if (e.name === "TokenExpiredError") {
    }

    res.locals.accessToken = decoded;
  });
  next();
};

export const updateToken: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    jwt.verify(refreshToken, SECRET, verifyCallback(res, 420));

    const {
      accessToken: { id },
    } = res.locals;
    const user = await User.findOne({ id });
    if (user) {
      const accessToken = setToken({ id }, "1h");
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
    const token = req.cookies["v_at"];
    if (!token) {
      return res.status(401).send({ code: 401, error: "토큰이 존재하지 않습니다." });
    }

    jwt.verify(token, SECRET, verifyCallback(res, 419));
    next();
  } catch (e) {
    console.error(e);
    next(e);
  }
};

export const setToken = (id: object, time?: string) => {
  const newToken = jwt.sign(id, process.env.JWT_SECRET ?? "vegwins", { expiresIn: time });
  return newToken;
};

const verifyCallback = (res: Params[1], code: number) => (e: any, decoded: any) => {
  if (decoded) {
    res.locals.accessToken = decoded;
    return;
  }

  if (e.name === "TokenExpiredError") {
    return res.status(code).json({
      code: code,
      error: "토큰이 만료되었습니다.",
    });
  }
  return res.status(401).json({
    code: 401,
    error: "유효하지 않은 토큰입니다.",
  });
};
