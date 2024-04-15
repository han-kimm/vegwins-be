import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      maxLength: [10, "user.nickname: 10자를 초과했습니다."],
      required: [true, "user.nickname: 필수입니다."],
    },
    provider: {
      type: String,
      enum: {
        values: ["google"],
        message: "user.provider: 지원하는 로그인 방식이 아닙니다.",
      },
      required: [true, "user.provider: 필수입니다."],
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
