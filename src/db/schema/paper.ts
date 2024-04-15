import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxLength: [20, "paper.title: 20자를 초과했습니다."],
      required: [true, "paper.title: 필수입니다."],
    },
    category: {
      type: [String],
      required: [true, "paper.category: 필수입니다."],
    },
    description: {
      type: String,
      required: [true, "paper.description: 필수입니다."],
    },
    writer: {
      type: ObjectId,
      ref: "User",
      required: [true, "paper.writer: 필수입니다."],
    },
    comment: [
      {
        type: ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Paper", paperSchema);
