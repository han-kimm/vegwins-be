"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
require("./loadEnv");
require("./db/connect");
const paper_1 = __importDefault(require("./routes/paper"));
const error_1 = require("./error");
// initialize
const app = (0, express_1.default)();
app.set("port", process.env.PORT || 8080);
// middlewares
app.use((0, morgan_1.default)("combined"));
// routes
app.get("/", (req, res) => {
    res.send({ data: "hello world" });
});
app.use("/paper", paper_1.default);
// error handling
app.use(error_1.notFound);
app.use(error_1.errorHandler);
// listen
app.listen(app.get("port"), () => {
    console.log(`server connected : http://localhost:${app.get("port")}`);
});
