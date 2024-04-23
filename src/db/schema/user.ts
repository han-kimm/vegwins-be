import { ObjectId } from "mongodb";
import mongoose, { Schema, Types } from "mongoose";
import { MAXLENGTH, PROVIDER, REQUIRED } from "../../constants/errorMessage";
import { IPaper } from "./paper";

type StringKey = "sub" | "nickname";
type StringMember = {
  [key in StringKey]: String;
};

export interface IUser extends StringMember {
  provider: "google";
  paper: Types.DocumentArray<IPaper>;
  comment: Types.DocumentArray<any>;
  rating: Types.DocumentArray<{ _id: Types.ObjectId; rating: number }>;
}

const userSchema = new mongoose.Schema<IUser>(
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
        type: Schema.Types.ObjectId,
        ref: "Paper",
      },
    ],
    comment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    rating: [
      {
        _id: Schema.Types.ObjectId,
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
