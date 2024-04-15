"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    nickname: {
        type: String,
        maxLength: [10, "user.nickname: 10자를 초과했습니다."],
        required: true,
    },
    paper: [
        {
            type: mongodb_1.ObjectId,
            ref: "Paper",
        },
    ],
    comment: [
        {
            type: mongodb_1.ObjectId,
            ref: "Comment",
        },
    ],
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("User", userSchema);
