import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { MAXLENGTH, PROVIDER, REQUIRED } from "../../constants/errorMessage";

const userSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      maxLength: [10, MAXLENGTH(10)],
      required: [true, REQUIRED],
    },
    provider: {
      type: String,
      enum: {
        values: ["google"],
        message: PROVIDER,
      },
      required: [true, REQUIRED],
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
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export default mongoose.model("User", userSchema);
