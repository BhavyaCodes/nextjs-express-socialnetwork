const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const requireLogin = require("../middlewares/requireLogin");

router.get("/api/posts", async (req, res, next) => {
  const posts = await Post.find();
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

module.exports = router;
