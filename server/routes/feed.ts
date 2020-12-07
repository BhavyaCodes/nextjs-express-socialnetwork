import { Router, Request, Response, NextFunction } from "express";
import Post from "../models/Post";
import User from "../models/User";
import requireLogin from "../middlewares/requireLogin";

const router = Router();

router.get("/posts", async (req: any, res: Response, next: NextFunction) => {
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
});

router.post(
  "/newpost",
  requireLogin,
  async (req: any, res: Response, next: NextFunction) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      creator: req.user._id,
    });

    const savedPost = await post.save();
    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: savedPost._id },
    });
    res.status(201).json({ post: savedPost });
  }
);

router.post(
  "/like",
  requireLogin,
  async (req: any, res: Response, next: NextFunction) => {
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
        .execPopulate();

      await User.findByIdAndUpdate(req.user._id, {
        $push: { likes: postId },
      });
      res.status(201).json(updatedPost);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

router.post(
  "/unlike",
  requireLogin,
  async (req: any, res: Response, next: NextFunction) => {
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
        .execPopulate();
      res.status(200).json(updatedPost);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
);

router.post(
  "/addcomment",
  requireLogin,
  async (req: any, res: Response, next: NextFunction) => {
    const userId: string = req.user._id;
    const { postId, content } = req.body;
    const comment: {
      creator: string;
      content: string;
    } = {
      creator: userId,
      content,
    };
    const savedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: comment,
        },
      },
      { new: true }
    );
    res.status(201).json(savedPost);
  }
);

router.delete(
  "/deletepost/:id",
  requireLogin,
  async (req: any, res: Response, next: NextFunction) => {
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
  }
);

export default router;
