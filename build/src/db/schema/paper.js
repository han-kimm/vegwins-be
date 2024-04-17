"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const errorMessage_1 = require("../../constants/errorMessage");
const paperSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        maxLength: [20, (0, errorMessage_1.MAXLENGTH)(20)],
        required: [true, errorMessage_1.REQUIRED],
    },
    category: {
        type: [String],
        required: [true, errorMessage_1.REQUIRED],
    },
    description: {
        type: String,
        maxLength: [300, (0, errorMessage_1.MAXLENGTH)(300)],
        required: [true, errorMessage_1.REQUIRED],
    },
    writer: {
        type: String,
        ref: "User",
        required: [true, errorMessage_1.REQUIRED],
    },
    comment: [
        {
            type: mongodb_1.ObjectId,
            ref: "Comment",
        },
    ],
    imageUrl: String,
    hashtag: [String],
    rating: {
        [0]: Number,
        [1]: Number,
        [2]: Number,
    },
}, {
    timestamps: true,
});
const Paper = mongoose_1.default.model("Paper", paperSchema);
exports.default = Paper;
