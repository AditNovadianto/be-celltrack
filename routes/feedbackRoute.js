import express from "express";
import {
  createFeedback,
  getFeedbackByUserId,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/submitFeedback", createFeedback);
router.get("/getFeedbackByUserId/:user_id", getFeedbackByUserId);

export default router;
