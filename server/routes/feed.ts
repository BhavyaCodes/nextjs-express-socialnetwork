import { Router, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Post from "../models/Post";
import User from "../models/User";
import requireLogin from "../middlewares/requireLogin";

const router = Router();

router.get("/posts", async (req, res, next) => {
  const posts = await Post.find().populate("creator");
  res.send({ posts });
});

router.post(
  "/newpost",
  requireLogin,
  async (req: any, res: Response, next: NextFunction) => {
    console.log(req.user);
    console.log(req.body);
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      creator: req.user._id,
    });

    const savedPost = await post.save();
    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: savedPost._id },
    });
    res.status(201).send({ post: savedPost });
  }
);

router.delete(
  "/deletepost/:id",
  async (req: any, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { posts: id },
      });
      await Post.findByIdAndDelete(id);

      res.status(200).send({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false });
    }
  }
);

export default router;
