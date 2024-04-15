import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const paperSchema = new mongoose.Schema(
  {
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
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Paper", paperSchema);
