import mongoose, { Schema, Types } from "mongoose";
import { REQUIRED } from "../../constants/errorMessage";

export interface IComment {
  user: Types.ObjectId;
  type: "comment" | "recomment" | "view" | "rating";
  paper: Types.ObjectId;
  comment?: Types.ObjectId;
}

const notificationSchema = new mongoose.Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, REQUIRED],
    },
    type: {
      type: String,
      enum: {
        values: ["comment", "recomment", "view", "rating"],
      },
      required: [true, REQUIRED],
    },
    paper: {
      type: Schema.Types.ObjectId,
      ref: "Paper",
      required: [true, REQUIRED],
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
