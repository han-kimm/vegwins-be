"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const errorMessage_1 = require("../../constants/errorMessage");
const userSchema = new mongoose_1.default.Schema({
    nickname: {
        type: String,
        maxLength: [10, (0, errorMessage_1.MAXLENGTH)(10)],
        required: [true, errorMessage_1.REQUIRED],
    },
    provider: {
        type: String,
        enum: {
            values: ["google"],
            message: errorMessage_1.PROVIDER,
        },
        required: [true, errorMessage_1.REQUIRED],
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
