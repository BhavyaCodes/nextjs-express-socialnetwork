import { Router, Request, Response, NextFunction } from "express";
import User from "../models/User";

const router = Router();

router.get("/profile/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: "posts",
        populate: {
          path: "creator",
        },
      })
      .populate("likes");
    res.send(user);
  } catch (error) {
    res.status(404).send();
  }
});

export default router;
