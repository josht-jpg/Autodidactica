import express from "express";
const router = express.Router();
import {
  getRemovedItems,
  restoreItem,
  deleteItem,
} from "../controllers/trashController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/items").get(protect, getRemovedItems);
router.route("/items").delete(protect, deleteItem);

router.route("/restore").post(protect, restoreItem);

export default router;
