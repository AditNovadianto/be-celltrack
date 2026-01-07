import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  cancelServiceRequest,
  createServiceRequest,
  getAllServiceRequests,
  getServiceRequestById,
  takeServiceRequest,
  updateStatusServiceRequest,
} from "../controllers/serviceRequestController.js";

const router = express.Router();

router.post("/createServiceRequest", verifyToken, createServiceRequest);
router.get("/getAllServiceRequests", verifyToken, getAllServiceRequests);
router.post("/getServiceRequestById", verifyToken, getServiceRequestById);
router.put("/takeServiceRequest", verifyToken, takeServiceRequest);
router.put(
  "/updateStatusServiceRequest",
  verifyToken,
  updateStatusServiceRequest
);
router.put("/cancelServiceRequest", verifyToken, cancelServiceRequest);

export default router;
