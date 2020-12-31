import mongoose, { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  name: string;
  imageUrl: string;
  posts: (string | Schema.Types.ObjectId)[];
}

const userSchema = new Schema({
  googleId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  // likes: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: "Post",
  //   },
  // ],
});

export default model<IUser>("User", userSchema);
