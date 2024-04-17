import express, { json, urlencoded } from "express";
import morgan from "morgan";
import "./loadEnv";
import "./db/connect";
import paperRouter from "./routes/paper";
import { errorHandler, notFound } from "./error";
import authRouter from "./routes/auth";
import compression from "compression";

// initialize
const app = express();
app.set("port", process.env.PORT || 8080);

// middlewares
app.use(compression());
app.use(morgan("short"));
app.use(json());
app.use(urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.send({ data: "hello world" });
});

app.use("/paper", paperRouter);
app.use("/auth", authRouter);

// error handling
app.use(notFound);
app.use(errorHandler);

// listen
app.listen(app.get("port"), () => {
  console.log(`server connected : http://localhost:${app.get("port")}`);
});
