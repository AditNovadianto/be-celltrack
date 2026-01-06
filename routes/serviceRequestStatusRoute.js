import express from "express";
import {
  getAllServiceRequestStatus,
  markServiceRequestStatusAsRead,
} from "../controllers/serviceRequestStatusController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/getAllServiceRequestStatus",
  verifyToken,
  getAllServiceRequestStatus
);
router.post(
  "/markServiceRequestStatusAsRead/:id",
  verifyToken,
  markServiceRequestStatusAsRead
);

export default router;
