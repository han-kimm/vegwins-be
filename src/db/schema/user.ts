import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { MAXLENGTH, PROVIDER, REQUIRED } from "../../constants/errorMessage";

const userSchema = new mongoose.Schema(
  {
    sub: {
      type: String,
      required: [true, REQUIRED],
    },
    nickname: {
      type: String,
      maxLength: [15, MAXLENGTH(15)],
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
    rating: [
      {
        _id: ObjectId,
        rating: Number,
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

const User = mongoose.model("User", userSchema);

export default User;
