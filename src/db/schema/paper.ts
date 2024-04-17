import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { MAXLENGTH, REQUIRED } from "../../constants/errorMessage";

const paperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxLength: [20, MAXLENGTH(20)],
      required: [true, REQUIRED],
    },
    category: {
      type: [String],
      required: [true, REQUIRED],
    },
    description: {
      type: String,
      maxLength: [300, MAXLENGTH(300)],
      required: [true, REQUIRED],
    },
    writer: {
      type: String,
      ref: "User",
      required: [true, REQUIRED],
    },
    comment: [
      {
        type: ObjectId,
        ref: "Comment",
      },
    ],
    imageUrl: String,
    hashtag: [String],
    rating: {
      [0]: Number,
      [1]: Number,
      [2]: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Paper = mongoose.model("Paper", paperSchema);
export default Paper;
