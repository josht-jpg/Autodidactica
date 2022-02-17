import express from "express";
const router = express.Router();
import {
  getMyGoals,
  getReadingGoals,
  getGoalsByResource,
  addGoal,
  changeStatus,
  editPlan,
  editTextData,
  insertText,
  insertImageEmbed,
  insertImageUpload,
  insertVideo,
  insertLink,
  insertDivider,
  editText,
  editCaption,
  removeGoal,
  removeElement,
  getAddGoalScreenData,
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

import multer from "multer";
let storage = multer.memoryStorage();
let upload = multer({ storage: storage });

router.route("/").get(protect, getMyGoals);
router.route("/").post(protect, addGoal);
router.route("/").delete(protect, removeGoal);

router.route("/reading").get(protect, getReadingGoals);
router.route("/resource").get(protect, getGoalsByResource);

router.route("/status").post(protect, changeStatus);

router.route("/plan").put(protect, editPlan);

router.route("/text").put(protect, editTextData);

router.route("/insert/text").post(protect, insertText);
router
  .route("/insert/image/upload")
  .post(protect, upload.single("file"), insertImageUpload);
router.route("/insert/image/embed").post(protect, insertImageEmbed);
router.route("/insert/video").post(protect, insertVideo);
router.route("/insert/link").post(protect, insertLink);
router.route("/insert/divider").post(protect, insertDivider);

router.route("/edit/text").put(protect, editText);
router.route("/edit/caption").put(protect, editCaption);

router.route("/remove/element").delete(protect, removeElement);

router.route("/add/screen").get(protect, getAddGoalScreenData);

export default router;
