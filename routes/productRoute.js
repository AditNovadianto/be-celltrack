import express from "express";
import {
  deleteProduct,
  getAllProducts,
  getProductById,
  storeProducts,
  updateProduct,
} from "../controllers/productController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/storeProducts", verifyToken, storeProducts);
router.get("/getAllProducts", verifyToken, getAllProducts);
router.get("/getProductById/:id", verifyToken, getProductById);
router.put("/updateProduct/:id", verifyToken, updateProduct);
router.delete("/deleteProduct/:id", verifyToken, deleteProduct);

export default router;
