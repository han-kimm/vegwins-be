"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const express_1 = __importStar(require("express"));
const fs_1 = require("fs");
const morgan_1 = __importDefault(require("morgan"));
const https_1 = __importDefault(require("https"));
require("./loadEnv");
require("./db/connect");
const error_1 = require("./error");
const routes_1 = __importDefault(require("./routes"));
// initialize
const app = (0, express_1.default)();
app.set("port", process.env.PORT || 8080);
const options = {
    key: (0, fs_1.readFileSync)("https/server.key"),
    cert: (0, fs_1.readFileSync)("https/server.crt"),
    ca: (0, fs_1.readFileSync)("https/server.csr"),
};
// middlewares
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)("short"));
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: true }));
// routes
app.use("/api", routes_1.default);
// error handling
app.use(error_1.notFound);
app.use(error_1.errorHandler);
// listen;
https_1.default.createServer(options, app).listen(8000, () => {
    console.log("https connected");
});
