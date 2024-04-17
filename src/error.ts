import { ErrorRequestHandler, RequestHandler } from "express";

interface CustomError extends Error {
  status?: number;
}

export const notFound: RequestHandler = (req, _, next) => {
  const error: CustomError = new Error(`${req.method} ${req.url} 해당하는 주소가 없습니다.`);
  error.status = 404;
  next(error);
};

export const errorHandler: ErrorRequestHandler = (err, _, res, __) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500).send();
};
