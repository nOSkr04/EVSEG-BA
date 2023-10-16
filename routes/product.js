import { Router } from "express";
import { protect } from "../middleware/protect.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controller/product.js";

const router = Router();

router.route("/").get(getProducts).post(protect, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .delete(protect, deleteProduct)
  .put(protect, updateProduct);

export default router;
