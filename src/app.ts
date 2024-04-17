import express, { json, urlencoded } from "express";
import morgan from "morgan";
import "./loadEnv";
import "./db/connect";
import paperRouter from "./routes/paper";
import { errorHandler, notFound } from "./error";
import authRouter from "./routes/auth";
import compression from "compression";
import indexRouter from "./routes";

// initialize
const app = express();
app.set("port", process.env.PORT || 8080);

// middlewares
app.use(compression());
app.use(morgan("short"));
app.use(json());
app.use(urlencoded({ extended: true }));

// routes
app.use("/api", indexRouter);

// error handling
app.use(notFound);
app.use(errorHandler);

// listen
app.listen(app.get("port"), () => {
  console.log(`server connected : http://localhost:${app.get("port")}`);
});
