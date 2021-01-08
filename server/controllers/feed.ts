import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
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

    const postsWithLikes = posts.map((post) => {
      return { ...post, likeCount: post.likes.length };
    });
    if (!req.user) {
      return res.json({ posts: postsWithLikes });
    }
    res.json({ posts: postsWithLikes });
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
  res.status(201).json({ post: savedPost });
};

export const likePost = async (req: any, res: Response, next: NextFunction) => {
  const { postId } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const post = await Post.findById(postId);
  try {
    const updatedPost = (
      await (
        await Post.findByIdAndUpdate(
          postId,
          {
            $addToSet: { likes: req.user._id },
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
        .execPopulate()
    ).toObject();

    res
      .status(201)
      .json({ ...updatedPost, likeCount: updatedPost.likes.length });
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { postId } = req.body;
  try {
    const updatedPost = (
      await (
        await Post.findByIdAndUpdate(
          postId,
          {
            $pull: { likes: req.user._id },
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
        .execPopulate()
    ).toObject();
    res
      .status(200)
      .json({ ...updatedPost, likeCount: updatedPost.likes.length });
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
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
    const savedPost = (
      await (
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
      ).execPopulate()
    ).toObject();
    console.log(savedPost);
    if (savedPost) {
      return res
        .status(201)
        .json({ ...savedPost, likeCount: savedPost.likes.length });
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
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
      const savedPost = (
        await (await post.save())
          .populate("creator")
          .populate("likes")
          .populate({
            path: "comments",
            populate: {
              path: "creator",
            },
          })
          .execPopulate()
      ).toObject();
      return res
        .status(200)
        .json({ ...savedPost, likeCount: savedPost.likes.length });
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
