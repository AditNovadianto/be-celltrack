import express from "express";
import {
  assignProductToEmployeeByEmployeeId,
  deleteProduct,
  exportProductsExcel,
  getAllProducts,
  getProductById,
  reStockProduct,
  storeProducts,
  updateProduct,
} from "../controllers/productController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/storeProducts", verifyToken, storeProducts);
router.get("/getAllProducts", verifyToken, getAllProducts);
router.get("/getProductById/:id", verifyToken, getProductById);
router.put("/updateProductById/:id", verifyToken, updateProduct);
router.put(
  "/assignProductToEmployee/:id",
  verifyToken,
  assignProductToEmployeeByEmployeeId,
);
router.put("/reStockProduct", verifyToken, reStockProduct);
router.delete("/deleteProduct/:id", verifyToken, deleteProduct);
router.get("/exportExcel", verifyToken, exportProductsExcel);

export default router;
