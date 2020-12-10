import { Router } from "express";
import { getProfileById } from "../controllers/user";

const router = Router();

router.get("/profile/:id", getProfileById);

export default router;
