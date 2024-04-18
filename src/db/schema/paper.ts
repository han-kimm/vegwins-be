import mongoose, { Schema, Types } from "mongoose";
import { MAXLENGTH, REQUIRED } from "../../constants/errorMessage";

export interface IPaper {
  title: string;
  category: string[];
  description: string;
  writer: Types.ObjectId;
  comment?: string[];
  imageUrl?: string;
  hashtag: string[];
  rating?: {
    [0]: number;
    [1]: number;
    [2]: number;
    length: number;
  };
  end: boolean;
  view: number;
  createdAt: Date;
  updatedAt: Date;
  isWriter?: boolean;
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
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, REQUIRED],
    },
    imageUrl: String,
    hashtag: [String],
    rating: {
      [0]: Number,
      [1]: Number,
      [2]: Number,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

paperSchema.virtual("rated").get(function () {
  if (this.rating) {
    return (this.rating?.[1] ?? 0 * 0.5 + (this.rating?.[2] ?? 0)) / (this.rating?.length ?? 1);
  }
  return 0;
});

const Paper = mongoose.model<IPaper>("Paper", paperSchema);
export default Paper;
