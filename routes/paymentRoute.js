import express from "express";
import {
  createVirtualAccount,
  midtransCallback,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/payments/create-va", createVirtualAccount);
router.post("/midtrans/callback", midtransCallback);

export default router;
