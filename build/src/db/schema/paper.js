"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const paperSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        maxLength: [20, "paper.title: 20자를 초과했습니다."],
        required: true,
    },
    imageUrl: String,
    hashtag: [String],
    rating: {
        [0]: Number,
        [1]: Number,
        [2]: Number,
    },
    category: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    writer: {
        type: mongodb_1.ObjectId,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("Paper", paperSchema);
