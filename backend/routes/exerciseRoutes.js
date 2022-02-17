import express from "express";
const router = express.Router();
import {
  getMyExercises,
  addExercise,
  getData,
  editTextData,
  insertText,
  insertImageUpload,
  insertImageEmbed,
  insertVideo,
  insertLink,
  insertDivider,
  editCaption,
  removeElement,
  removeExercise,
  editText,
} from "../controllers/exerciseController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.route("/").get(protect, getMyExercises);
router.route("/").post(protect, addExercise);
router.route("/").delete(protect, removeExercise);

router.route("/data").get(protect, getData);

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

export default router;
