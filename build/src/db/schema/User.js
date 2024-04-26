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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Paper",
        },
    ],
    comment: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    rating: [
        {
            _id: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Paper",
            },
            rating: Number,
        },
    ],
    notification: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Notification",
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
