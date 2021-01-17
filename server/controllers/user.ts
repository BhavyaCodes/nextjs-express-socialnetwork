import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Post from "../models/Post";

export const getProfileById = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userPostsPromise = Post.find({ creator: req.params.id })
      .populate("creator", ["imageUrl", "name"])
      .populate("likes", ["imageUrl", "name"])
      .populate({
        path: "comments",
        populate: {
          path: "creator",
          select: ["imageUrl", "name"],
        },
      });

    const userPromise = User.findById(req.params.id, {
      name: 1,
      imageUrl: 1,
    }).lean();
    const [userPosts, user] = await Promise.all([
      userPostsPromise,
      userPromise,
    ]);

    const userPostsWithLikes = userPosts.map((post) => {
      return { ...post.toObject(), likeCount: post.likes.length };
    });
    res.send({ ...user, posts: userPostsWithLikes });
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
};
