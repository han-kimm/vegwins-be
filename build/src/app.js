"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.set("port", process.env.PORT || 8080);
// middlewares
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 서버 시작,");
});
