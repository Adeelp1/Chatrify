import express from "express";
import { signupUser, loginUser, autoLogin, logoutUser } from "../controllers/authController.js";

const router = express.Router();

// AutoLogin route
router.post("/", autoLogin);

// Signup route
router.post("/signup", signupUser);

// Login route
router.post("/login", loginUser);

// Logout route
router.post("/logout", logoutUser);

export default router;