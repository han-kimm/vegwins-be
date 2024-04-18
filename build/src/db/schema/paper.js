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
        length: Number,
    },
    end: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
});
paperSchema.virtual("rated").get(function () {
    var _a, _b, _c, _d, _e, _f;
    if (this.rating) {
        return ((_b = (_a = this.rating) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 0 * 0.5 + ((_d = (_c = this.rating) === null || _c === void 0 ? void 0 : _c[2]) !== null && _d !== void 0 ? _d : 0)) / ((_f = (_e = this.rating) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 1);
    }
    return 0;
});
const Paper = mongoose_1.default.model("Paper", paperSchema);
exports.default = Paper;
