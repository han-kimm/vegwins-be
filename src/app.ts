import compression from "compression";
import express, { json, urlencoded } from "express";
import morgan from "morgan";
import "./loadEnv";
import "./db/connect";
import { errorHandler, notFound } from "./error";
import indexRouter from "./routes";
import cookieParser from "cookie-parser";

// initialize
const app = express();
app.set("port", process.env.PORT || 8080);

// middlewares
app.use(compression());
app.use(morgan("short"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser("vegwins"));

// routes
app.use("/", indexRouter);

// error handling
app.use(notFound);
app.use(errorHandler);

// listen;
app.listen(app.get("port"), () => {
  console.log("server connected");
});

let count = 0;
app.on("diconnected", () => {
  if (count < 3) {
    count++;
    app.listen(app.get("port"), () => {
      console.log("server connected");
    });
  }
});
