import { Router } from "express";
import { body } from "express-validator";
import requireLogin from "../middlewares/requireLogin";
import imageUpload from "../middlewares/imageUpload";
import {
  getPosts,
  createNewPost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  deletePost,
} from "../controllers/feed";

const router = Router();

router.get("/posts", getPosts);

router.post(
  "/newpost",
  requireLogin,
  imageUpload.single("image"),
  createNewPost
);

router.post("/like", requireLogin, [body("postId").isMongoId()], likePost);

router.post("/unlike", requireLogin, unlikePost);

router.post(
  "/addcomment",
  requireLogin,
  [
    body("content").trim().isLength({ min: 1, max: 150 }),
    body("postId").isMongoId(),
  ],
  addComment
);

router.post(
  "/deletecomment/:postId/:commentId",
  requireLogin,
  [body("postId").isMongoId()],
  deleteComment
);

router.delete("/deletepost/:id", requireLogin, deletePost);

export default router;
