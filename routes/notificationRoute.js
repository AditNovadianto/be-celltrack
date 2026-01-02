import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  getAllNotifications,
  markNotificationAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/getAllNotifications", verifyToken, getAllNotifications);
router.post("/markNotificationAsRead/:id", verifyToken, markNotificationAsRead);

export default router;
