import mongoose, { Schema, Types } from "mongoose";
import { MAXLENGTH, PROVIDER, REQUIRED } from "../../constants/errorMessage";

type StringKey = "sub" | "nickname";
type StringMember = {
  [key in StringKey]: String;
};

export interface IUser extends StringMember {
  provider: "google";
  paper: Types.DocumentArray<Types.ObjectId>;
  comment: Types.DocumentArray<Types.ObjectId>;
  notification: Types.DocumentArray<Types.ObjectId>;
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
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Paper",
        },
        rating: Number,
      },
    ],
    notification: [
      {
        type: Schema.Types.ObjectId,
        ref: "Notification",
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
