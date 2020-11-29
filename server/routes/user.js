const router = require("express").Router();
const Post = require("../models/Post");
const requireLogin = require("../middlewares/requireLogin");

router.post("/api/newpost", requireLogin, async (req, res, next) => {
  console.log(req.body);
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  await post.save();
  res.status(201).send();
});

module.exports = router;
