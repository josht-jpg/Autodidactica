import express from "express";
const router = express.Router();
import {
  getMyProjects,
  addProject,
  addProjectWithFile,
  removeProject,
  getData,
  insertText,
  insertImageEmbed,
  insertImageUpload,
  insertVideo,
  insertLink,
  insertDivider,
  editText,
  editCaption,
  editTitle,
  editDescription,
  removeElement,
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

import multer from "multer";

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.route("/").get(protect, getMyProjects);
router.route("/").post(protect, addProject);
router
  .route("/withFile")
  .post(protect, upload.single("file"), addProjectWithFile);
router.route("/").delete(protect, removeProject);

router.route("/data").get(protect, getData);

//should be post
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
router.route("/edit/title").put(protect, editTitle);
router.route("/edit/description").put(protect, editDescription);

router.route("/remove/element").delete(protect, removeElement);

export default router;
