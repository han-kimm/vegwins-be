import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    writer: {
      type: ObjectId,
      ref: "User",
      required: [true, "comment.writer: 필수입니다."],
    },
    content: {
      type: String,
      required: [true, "comment.content: 필수입니다."],
    },
    recomment: [
      {
        type: ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export default mongoose.model("Comment", commentSchema);
