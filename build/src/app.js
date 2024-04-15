"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
require("./loadEnv");
require("./db/connect");
// initialize
const app = (0, express_1.default)();
app.set("port", process.env.PORT || 8080);
// middlewares
app.use((0, morgan_1.default)("combined"));
// routes
app.get("/", (req, res) => {
    res.send({ data: "hello world" });
});
// listen
app.listen(app.get("port"), () => {
    console.log(`server connected : http://localhost:${app.get("port")}`);
});
