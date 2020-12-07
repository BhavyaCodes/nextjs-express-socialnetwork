import mongoose, { Document, Schema, model } from "mongoose";

export interface IPost extends Document {
  _id: string | Schema.Types.ObjectId;
  title: string;
  content: string;
  creator: string | Schema.Types.ObjectId;
  likeCount: number;
  likes: Schema.Types.ObjectId[];
  comments: Comment[];
}

type Comment = {
  creator: string | Schema.Types.ObjectId;
  content: string;
};

const commentSchema = new Schema<Comment>(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

export default model<IPost>("Post", postSchema);
