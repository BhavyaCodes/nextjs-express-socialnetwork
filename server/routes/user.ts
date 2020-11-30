import { Router, Request, Response, NextFunction } from "express";
import Post from "../models/Post";
import User, { IUser } from "../models/User";
import requireLogin from "../middlewares/requireLogin";

const router = Router();

router.get("/api/posts", async (req, res, next) => {
  const posts = await Post.find().populate("creator");
  res.send({ posts });
});

router.post(
  "/api/newpost",
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

router.get("/api/profile/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("posts");
    res.send(user);
  } catch (error) {
    res.status(404).send();
  }
});

export default router;
