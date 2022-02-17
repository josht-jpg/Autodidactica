import express from "express";

const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUserInfo,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").post(registerUser);
router.route("/").delete(protect, deleteUser);
router.route("/info").get(protect, getUserInfo);
router.post("/login", authUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
