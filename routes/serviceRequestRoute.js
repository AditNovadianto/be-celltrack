import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createServiceRequest,
  getAllServiceRequests,
  takeServiceRequest,
  updateStatusServiceRequest,
} from "../controllers/serviceRequestController.js";

const router = express.Router();

router.post("/createServiceRequest", verifyToken, createServiceRequest);
router.get("/getAllServiceRequests", verifyToken, getAllServiceRequests);
router.put("/takeServiceRequest", verifyToken, takeServiceRequest);
router.put(
  "/updateStatusServiceRequest",
  verifyToken,
  updateStatusServiceRequest
);

export default router;
