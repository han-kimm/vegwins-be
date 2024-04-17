import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const verifyToken: RequestHandler = (req, res, next) => {
  const token = JSON.parse(req.cookies["v_at"]);
  try {
    res.locals.decoded = jwt.verify(token, process.env.JWT_SECRET ?? "", (err: any, decoded: any) => {
      console.log(decoded);
      console.log(new Date(decoded.exp));
    });
    return next();
  } catch (e: any) {
    if (e.name === "TokenExpiredError") {
      return res.status(419).json({
        code: 419,
        error: "토큰이 만료되었습니다.",
      });
    }
    return res.status(401).json({
      code: 401,
      error: "유효하지 않은 토큰입니다.",
    });
  }
};

export const setToken = (id: object, time?: string) => {
  const newToken = jwt.sign(id, process.env.JWT_SECRET ?? "vegwins", { expiresIn: time });
  return newToken;
};
