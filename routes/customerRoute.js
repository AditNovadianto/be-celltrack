import express from "express";
import {
  createCustomer,
  getAllCustomers,
} from "../controllers/customerController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/createCustomer", verifyToken, createCustomer);
router.get("/getAllCustomers", verifyToken, getAllCustomers);

export default router;
