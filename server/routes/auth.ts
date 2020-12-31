import { Router } from "express";
import { Types } from "mongoose";
const router = Router();
import passport from "passport";
import Post from "../models/Post";

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google"),
  (req, res, next) => {
    res.redirect("/");
  }
);

router.get("/api/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/api/current_user", async (req: any, res) => {
  if (!req.user) {
    return res.status(401).send();
  }
  const id = Types.ObjectId(req.user._id);
  const likedPosts = await Post.find(
    {
      likes: { $elemMatch: { $eq: id } },
    },
    "_id"
  ).lean();
  const likedPostsArray = likedPosts.map((obj) => obj._id);
  res.send({ ...req.user.toObject(), likes: likedPostsArray });
});

export default router;
