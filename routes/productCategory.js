import { Router } from "express";
const router = Router();
import { protect, authorize } from "../middleware/protect.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from "../controller/productCategory.js";

router
  .route("/")
  .get(getCategories) 
  .post(protect, authorize("admin"), createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(protect, authorize("admin", "operator"), updateCategory)
  .delete(protect, authorize("admin"), deleteCategory);

export default router;
