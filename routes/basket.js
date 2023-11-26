import { Router } from "express";
import { protect } from "../middleware/protect.js";

import {
  getBaskets,
  getBasket,
  createBasket,
  deleteBasket,
} from "../controller/basket.js";

const router = Router();

//"/api/v1/Baskets"

router.route("/").get(protect, getBaskets).post(protect, createBasket);

router
  .route("/:id")
  .get(getBasket)
  .delete(protect, deleteBasket);

export default router;
