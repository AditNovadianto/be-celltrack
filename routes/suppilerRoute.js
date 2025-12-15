import express from "express";
import {
  signInSupplier,
  signUpSupplier,
} from "../controllers/supplierController.js";

const router = express.Router();

router.post("/signUpSuppliers", signUpSupplier);
router.post("/signInSuppliers", signInSupplier);

export default router;
