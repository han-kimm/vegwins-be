import compression from "compression";
import express, { json, urlencoded } from "express";
import { readFileSync } from "fs";
import morgan from "morgan";
import https from "https";
import "./loadEnv";
import "./db/connect";
import { errorHandler, notFound } from "./error";
import indexRouter from "./routes";

// initialize
const app = express();
app.set("port", process.env.PORT || 8080);

const options = {
  key: readFileSync("https/server.key"),
  cert: readFileSync("https/server.crt"),
  ca: readFileSync("https/server.csr"),
};

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

// listen;

// app.listen(app.get("port"), () => {
//   console.log("server connected");
// });

https.createServer(options, app).listen(8000, () => {
  console.log("https connected");
});
