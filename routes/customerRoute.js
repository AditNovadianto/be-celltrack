import express from "express";
import {
  createCustomer,
  deleteCustomerById,
  getAllCustomers,
  getCustomerById,
  signInCustomer,
  updateCustomerById,
} from "../controllers/customerController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/signInCustomers", signInCustomer);
router.post("/createCustomer", verifyToken, createCustomer);
router.get("/getAllCustomers", verifyToken, getAllCustomers);
router.get("/getCustomerById/:id_customer", verifyToken, getCustomerById);
router.put(
  "/updateCustomerById/:id_pelanggan",
  verifyToken,
  updateCustomerById,
);
router.delete(
  "/deleteCustomerById/:id_pelanggan",
  verifyToken,
  deleteCustomerById,
);

export default router;
