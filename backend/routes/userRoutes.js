import express from "express";
import { register, login, sendResetEmail, verifyResetToken, resetPassword } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-email", sendResetEmail);
router.get("/verify-reset-token", verifyResetToken); // For verifying token
router.post("/reset-password", resetPassword);

export default router;
 