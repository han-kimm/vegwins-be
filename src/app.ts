import express from "express";
import morgan from "morgan";
import "./loadEnv";
import "./db/connect";

// initialize
const app = express();
app.set("port", process.env.PORT || 8080);

// middlewares
app.use(morgan("combined"));

// routes
app.get("/", (req, res) => {
  res.send({ data: "hello world" });
});

// listen
app.listen(app.get("port"), () => {
  console.log(`server connected : http://localhost:${app.get("port")}`);
});
