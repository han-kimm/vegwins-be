import mongoose, { Schema, Types } from "mongoose";
import { REQUIRED } from "../../constants/errorMessage";

export interface IComment {
  commenter: Types.ObjectId;
  content: string;
  paper: Types.ObjectId;
  recomment: Types.DocumentArray<IComment>;
  re: boolean;
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
    paper: {
      type: Schema.Types.ObjectId,
      ref: "Paper",
      required: [true, REQUIRED],
    },
    recomment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    re: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
