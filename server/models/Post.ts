import mongoose, { Document, Schema, model } from "mongoose";

export interface IPost extends Document {
  _id: string | Schema.Types.ObjectId;
  title: string;
  content: string;
  creator: string | Schema.Types.ObjectId;
}

const postSchema = new Schema({
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
});

export default model("Post", postSchema);
