import express from "express";
const router = express.Router();
import {
  storeChat,
  storeImprovement,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/chat").post(protect, storeChat);
router.route("/improvement").post(protect, storeImprovement);

export default router;
