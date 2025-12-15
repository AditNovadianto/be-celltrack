import express from "express";
import { signUp, signIn } from "../Controllers/authController.js";

const router = express.Router();

router.post("/signUpUsers", signUp);
router.post("/signInUsers", signIn);

export default router;
