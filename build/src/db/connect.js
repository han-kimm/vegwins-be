"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { ATLAS_URI } = process.env;
const uri = ATLAS_URI || "";
let connectCount = 0;
const dbConnect = () => {
    if (process.env.NODE_ENV !== "production") {
        mongoose_1.default.set("debug", true);
    }
    mongoose_1.default
        .connect(uri, { dbName: "vegwins" })
        .then(() => console.log("MongoDB connected"))
        .catch((err) => {
        console.log("MongoDB initialization Error", err);
        if (connectCount < 3) {
            connectCount++;
            dbConnect();
        }
    });
    mongoose_1.default.connection.on("error", (error) => {
        console.error("MongoDB Error", error);
    });
    mongoose_1.default.connection.on("disconnected", () => {
        console.error("MongoDB disconnected, try to reconnect...");
        if (connectCount < 3) {
            connectCount++;
            dbConnect();
        }
    });
};
dbConnect();
