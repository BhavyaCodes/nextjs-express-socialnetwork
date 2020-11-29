const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const requireLogin = require("../middlewares/requireLogin");

router.get("/api/posts", async (req, res, next) => {
  const posts = await Post.find().populate("creator");
  res.send({ posts });
});

router.post("/api/newpost", requireLogin, async (req, res, next) => {
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
});

router.get("/api/profile/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
