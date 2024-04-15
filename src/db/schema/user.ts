import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      maxLength: [10, "user.nickname: 10자를 초과했습니다."],
      required: true,
    },
    paper: [
      {
        type: ObjectId,
        ref: "Paper",
      },
    ],
    comment: [
      {
        type: ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
