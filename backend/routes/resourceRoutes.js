import express from "express";
const router = express.Router();
import {
  getMyResources,
  getMyBooks,
  getMyCourses,
  addResource,
  addBook,
  removeResource,
  getData,
  editTextData,
  insertText,
  insertImageEmbed,
  insertImageUpload,
  insertVideo,
  insertLink,
  insertDivider,
  editText,
  editCaption,
  editAuthors,
  removeElement,
} from "../controllers/resourceController.js";
import { protect } from "../middleware/authMiddleware.js";

import multer from "multer";

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.route("/").get(protect, getMyResources);
router.route("/").post(protect, addResource);
router.route("/book").post(protect, addBook);
router.route("/").delete(protect, removeResource);

router.route("/books").get(protect, getMyBooks);
router.route("/courses").get(protect, getMyCourses);
router.route("/data").get(protect, getData);

router.route("/insert/text").post(protect, insertText);
router
  .route("/insert/image/upload")
  .post(protect, upload.single("file"), insertImageUpload);
router.route("/insert/image/embed").post(protect, insertImageEmbed);
router.route("/insert/video").post(protect, insertVideo);
router.route("/insert/link").post(protect, insertLink);
router.route("/insert/divider").post(protect, insertDivider);

router.route("/text").put(protect, editTextData); //???

router.route("/edit/text").put(protect, editText);
router.route("/edit/caption").put(protect, editCaption);
router.route("/authors").put(protect, editAuthors);

router.route("/remove/element").delete(protect, removeElement);

export default router;
