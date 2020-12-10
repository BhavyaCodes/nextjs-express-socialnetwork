import { Router } from "express";
import requireLogin from "../middlewares/requireLogin";
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

router.post("/newpost", requireLogin, createNewPost);

router.post("/like", requireLogin, likePost);

router.post("/unlike", requireLogin, unlikePost);

router.post("/addcomment", requireLogin, addComment);

router.post("/deletecomment/:postId/:commentId", requireLogin, deleteComment);

router.delete("/deletepost/:id", requireLogin, deletePost);

export default router;
