import mongoose, { Schema, Types } from "mongoose";
import { MAXLENGTH, REQUIRED } from "../../constants/errorMessage";

export interface IPaper {
  _id: Types.ObjectId;
  title: string;
  category: string[];
  description: string;
  writer: Types.ObjectId;
  commenter: Types.DocumentArray<Types.ObjectId>;
  rater: Types.DocumentArray<Types.ObjectId>;
  imageUrl: string[];
  hashtag: string[];
  rating: {
    [0]?: number;
    [1]?: number;
    [2]?: number;
    length?: number;
  };
  end: boolean;
  view: number;
  rated: number;
  createdAt: Date;
  updatedAt: Date;
}

const paperSchema = new mongoose.Schema<IPaper>(
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
    imageUrl: [String],
    hashtag: [String],
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, REQUIRED],
    },
    commenter: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rater: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rating: {
      "0": Number,
      "1": Number,
      "2": Number,
      length: Number,
    },
    end: {
      type: Boolean,
      default: false,
    },
    view: {
      type: Number,
      default: 0,
    },
    rated: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

paperSchema.pre("save", function (this: IPaper, next) {
  if (this.rating) {
    this.rated = Math.floor(((this.rating[1] ?? 0) * 50 + (this.rating[2] ?? 0) * 100) / (this.rating.length ?? 1));
    return next();
  }
  this.rated = 0;
  return next();
});

const Paper = mongoose.model<IPaper>("Paper", paperSchema);
export default Paper;
