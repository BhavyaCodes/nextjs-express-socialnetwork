import { Request, Response, NextFunction } from "express";
import Post from "../models/Post";
import User from "../models/User";

export const getPosts = async (req: any, res: Response, next: NextFunction) => {
  {
    const posts = await Post.find()
      .populate("creator")
      .populate("likes")
      .populate({
        path: "comments",
        populate: {
          path: "creator",
        },
      })
      .lean();

    if (!req.user) {
      return res.json({ posts });
    }
    res.json({ posts });
  }
};

export const createNewPost = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    creator: req.user._id,
    imageName: req.file ? req.file.filename : undefined,
  });

  const savedPost = await post.save();
  await User.findByIdAndUpdate(req.user._id, {
    $push: { posts: savedPost._id },
  });
  res.status(201).json({ post: savedPost });
};

export const likePost = async (req: any, res: Response, next: NextFunction) => {
  const { postId } = req.body;
  if (req.user.likes.includes(postId)) {
    return res.status(409).json({ error: "already liked" });
  }
  try {
    const updatedPost = await (
      await Post.findByIdAndUpdate(
        postId,
        {
          $push: { likes: req.user._id },
          $inc: { likeCount: 1 },
        },
        { new: true }
      )
    )
      .populate("creator")
      .populate("likes")
      .populate({
        path: "comments",
        populate: {
          path: "creator",
        },
      })
      .execPopulate();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { likes: postId },
    });
    res.status(201).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const unlikePost = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { postId } = req.body;
  if (!req.user.likes.includes(postId)) {
    return res
      .status(409)
      .json({ error: "can't unlike a post that wasn't liked" });
  }
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { likes: postId },
    });
    const updatedPost = await (
      await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: req.user._id },
          $inc: { likeCount: -1 },
        },
        { new: true }
      )
    )
      .populate("creator")
      .populate("likes")
      .populate({
        path: "comments",
        populate: {
          path: "creator",
        },
      })
      .execPopulate();
    res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const addComment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId: string = req.user._id;
  const { postId, content } = req.body;
  const comment: {
    creator: string;
    content: string;
  } = {
    creator: userId,
    content,
  };
  try {
    const savedPost = await (
      await Post.findByIdAndUpdate(
        postId,
        {
          $push: {
            comments: comment,
          },
        },
        { new: true }
      )
        .populate("creator")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "creator",
          },
        })
    ).execPopulate();
    if (savedPost) {
      return res.status(201).json(savedPost);
    }
    res.status(404).json({ error: "unable to save" });
  } catch (error) {
    res.status(500).send();
  }
};

export const deleteComment = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const {
    postId,
    commentId,
  }: { postId: string; commentId: string } = req.params;
  try {
    const post = await Post.findById(postId);

    const includes = post.comments.some((comment) => comment._id == commentId);
    if (req.user._id === post.creator || includes) {
      // permitted to delete
      post.comments.pull({ _id: commentId });
      const savedPost = await (await post.save())
        .populate("creator")
        .populate("likes")
        .populate({
          path: "comments",
          populate: {
            path: "creator",
          },
        })
        .execPopulate();
      return res.status(200).json(savedPost);
    } else {
      return res.status(401).send();
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deletePost = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id as string;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { posts: id },
    });
    await Post.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};
