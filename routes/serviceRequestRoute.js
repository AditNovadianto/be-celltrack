import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createServiceRequest,
  getAllServiceRequests,
} from "../controllers/serviceRequestController.js";

const router = express.Router();

router.post("/createServiceRequest", verifyToken, createServiceRequest);
router.get("/getAllServiceRequests", verifyToken, getAllServiceRequests);

export default router;
