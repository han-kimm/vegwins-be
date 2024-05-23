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
    imageUrl: [String],
    hashtag: [String],
    writer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, errorMessage_1.REQUIRED],
    },
    commenter: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    rater: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    rating: {
        "0": Number,
        "1": Number,
        "2": Number,
        length: Number,
    },
    end: {
        type: Boolean,
        default: false,
    },
    view: {
        type: Number,
        default: 0,
    },
    rated: {
        type: Number,
    },
}, {
    timestamps: true,
});
paperSchema.pre("save", function (next) {
    var _a, _b, _c;
    if (this.rating) {
        this.rated = Math.floor((((_a = this.rating[1]) !== null && _a !== void 0 ? _a : 0) * 50 + ((_b = this.rating[2]) !== null && _b !== void 0 ? _b : 0) * 100) / ((_c = this.rating.length) !== null && _c !== void 0 ? _c : 1));
        return next();
    }
    this.rated = 0;
    return next();
});
const Paper = mongoose_1.default.model("Paper", paperSchema);
exports.default = Paper;
