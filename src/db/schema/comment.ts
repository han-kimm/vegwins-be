import mongoose from "mongoose";
import { REQUIRED } from "../../constants/errorMessage";

const commentSchema = new mongoose.Schema(
  {
    writer: {
      type: String,
      ref: "User",
      required: [true, REQUIRED],
    },
    content: {
      type: String,
      required: [true, REQUIRED],
    },
    recomment: [
      {
        type: String,
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
