import mongoose, { Schema, Types } from "mongoose";
import { REQUIRED } from "../../constants/errorMessage";

interface IComment {
  commenter: Types.ObjectId;
  content: string;
  recomment: Types.DocumentArray<Types.ObjectId>;
}

const commentSchema = new mongoose.Schema<IComment>(
  {
    commenter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, REQUIRED],
    },
    content: {
      type: String,
      required: [true, REQUIRED],
    },
    recomment: [
      {
        type: Schema.Types.ObjectId,
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
