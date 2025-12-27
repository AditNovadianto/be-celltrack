import express from "express";
import {
  getAllSuppliers,
  signInSupplier,
  signUpSupplier,
} from "../controllers/supplierController.js";

const router = express.Router();

router.post("/signUpSuppliers", signUpSupplier);
router.post("/signInSuppliers", signInSupplier);
router.get("/getAllSuppliers", getAllSuppliers);

export default router;
