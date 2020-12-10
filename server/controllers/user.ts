import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const getProfileById = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: "posts",
        populate: {
          path: "creator",
        },
      })
      .populate({
        path: "posts",
        populate: {
          path: "comments",
          populate: {
            path: "creator",
          },
        },
      })
      .populate("likes");
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
};
