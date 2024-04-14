import express from "express";
import morgan from "morgan";

const app = express();

app.set("port", process.env.PORT || 8080);

// middlewares
app.use(morgan("combined"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 서버 시작,");
});
