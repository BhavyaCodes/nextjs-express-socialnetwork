import { Router } from "express";
import { body, param } from "express-validator";
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
  // [
  //   body("content")
  //     .trim()
  //     .isLength({ min: 1 })
  //     .withMessage("Empty content")
  //     .isLength({ max: 400 })
  //     .withMessage("Content more than maximum allowed 400 characters"),
  //   body("title")
  //     .trim()
  //     .isLength({ min: 1 })
  //     .withMessage("Empty content")
  //     .isLength({ max: 150 })
  //     .withMessage("Title more than maximum allowed 150 characters"),
  // ],
  createNewPost
);

router.post("/like", requireLogin, [body("postId").isMongoId()], likePost);

router.post("/unlike", requireLogin, [body("postId").isMongoId()], unlikePost);

router.post(
  "/addcomment",
  requireLogin,
  [
    body("content")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Empty comment")
      .isLength({ max: 150 })
      .withMessage("Comment more than maximum allowed 150 characters"),
    body("postId").isMongoId(),
  ],
  addComment
);

router.post(
  "/deletecomment/:postId/:commentId",
  requireLogin,
  [param("postId").isMongoId(), param("commentId").isMongoId()],
  deleteComment
);

router.delete("/deletepost/:id", requireLogin, deletePost);

export default router;
