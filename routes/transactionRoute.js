import express from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
} from "../controllers/transactionController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/createTransaction", verifyToken, createTransaction);
router.get("/getAllTransactions", verifyToken, getAllTransactions);
router.get(
  "/getTransactionById/:id_transaksi",
  verifyToken,
  getTransactionById
);

export default router;
