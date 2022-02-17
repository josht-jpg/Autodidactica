import express from "express";
const router = express.Router();
import {
  getTranscript,
  editTranscriptTextData,
  rearrangeResources,
  rearrangeExercises,
  rearrangeProjects,
  rearrangeNotepads,
  getMoreResources,
  insertText,
  insertImageUpload,
  insertImageEmbed,
  insertVideo,
  insertLink,
  insertDivider,
  editText,
  hideResource,
  getHiddenResources,
  hideExercise,
  hideProject,
  hideNotepad,
  getHiddenExercises,
  getHiddenProjects,
  getHiddenNotepads,
  exposeResource,
  exposeExercise,
  exposeProject,
  exposeNotepad,
  rearrangeAccomplishments,
  getHiddenAccomplishments,
  hideAccomplishment,
  exposeAccomplishment,
  editCaption,
  removeElement,
  makePrivate,
  makePublic,
  getPublicTranscript,
} from "../controllers/transcriptController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.route("/").get(protect, getTranscript);

router.route("/text").put(protect, editTranscriptTextData);

router
  .route("/rearrange/accomplishments")
  .put(protect, rearrangeAccomplishments);
router.route("/rearrange/resources").put(protect, rearrangeResources);
router.route("/rearrange/exercises").put(protect, rearrangeExercises);
router.route("/rearrange/projects").put(protect, rearrangeProjects);
router.route("/rearrange/notepads").put(protect, rearrangeNotepads);

//might cause problems
router.route("/resources").get(protect, getMoreResources);

router.route("/insert/text").post(protect, insertText);
router
  .route("/insert/image/upload")
  .post(protect, upload.single("file"), insertImageUpload);
router.route("/insert/image/embed").post(protect, insertImageEmbed);
router.route("/insert/video").post(protect, insertVideo);
router.route("/insert/link").post(protect, insertLink);
router.route("/insert/divider").post(protect, insertDivider);

router.route("/edit/text").put(protect, editText);

router.route("/hidden/accomplishment").get(protect, getHiddenAccomplishments);
router.route("/hidden/accomplishment").put(protect, hideAccomplishment);

router.route("/hidden/resource").get(protect, getHiddenResources);
router.route("/hidden/resource").put(protect, hideResource);

router.route("/hidden/exercise").get(protect, getHiddenExercises);
router.route("/hidden/exercise").put(protect, hideExercise);

router.route("/hidden/project").get(protect, getHiddenProjects);
router.route("/hidden/project").put(protect, hideProject);

router.route("/hidden/notepad").get(protect, getHiddenNotepads);
router.route("/hidden/notepad").put(protect, hideNotepad);

router.route("/expose/accomplishment").put(protect, exposeAccomplishment);
router.route("/expose/resource").put(protect, exposeResource);
router.route("/expose/exercise").put(protect, exposeExercise);
router.route("/expose/project").put(protect, exposeProject);
router.route("/expose/notepad").put(protect, exposeNotepad);

router.route("/edit/caption").put(protect, editCaption);

router.route("/remove/element").delete(protect, removeElement);

router.route("/public").put(protect, makePublic);
router.route("/private").put(protect, makePrivate);

router.route("/public").get(getPublicTranscript);

export default router;
