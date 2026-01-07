import express from "express";
import {
  createFeedback,
  getFeedbackByUserId,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/submitFeedback", createFeedback);
router.get("/getFeedbackByUserId/:id_pelanggan", getFeedbackByUserId);

export default router;
