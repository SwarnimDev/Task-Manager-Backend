import express from "express";
import { registerUser, loginUser, forgotPassword } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.post("/forgot-password", forgotPassword);

export default router;
