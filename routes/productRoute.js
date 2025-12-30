import express from "express";
import {
  assignProductToEmployeeByEmployeeId,
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
router.put("/updateProductById/:id", verifyToken, updateProduct);
router.put(
  "/assignProductToEmployee/:id",
  verifyToken,
  assignProductToEmployeeByEmployeeId
);
router.delete("/deleteProduct/:id", verifyToken, deleteProduct);

export default router;
