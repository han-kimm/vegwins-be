"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const errorMessage_1 = require("../../constants/errorMessage");
const userSchema = new mongoose_1.default.Schema({
    sub: {
        type: String,
        required: [true, errorMessage_1.REQUIRED],
    },
    nickname: {
        type: String,
        maxLength: [15, (0, errorMessage_1.MAXLENGTH)(15)],
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
    rating: [
        {
            _id: mongodb_1.ObjectId,
            rating: Number,
        },
    ],
}, {
    timestamps: {
        createdAt: true,
        updatedAt: false,
    },
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
