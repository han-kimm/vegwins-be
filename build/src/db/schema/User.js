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
        required: [true, "user.nickname: 필수입니다."],
    },
    provider: {
        type: String,
        enum: {
            values: ["google"],
            message: "user.provider: 지원하는 로그인 방식이 아닙니다.",
        },
        required: [true, "user.provider: 필수입니다."],
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
    timestamps: {
        createdAt: true,
        updatedAt: false,
    },
});
exports.default = mongoose_1.default.model("User", userSchema);
