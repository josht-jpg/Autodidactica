import express from "express";
const router = express.Router();
import {
  getMyNotes,
  addNotepad,
  updateNotepad,
  getNotesByResource,
  getNotesByProject,
  getNotesByDay,
  findNoteById,
  removeNotepad,
  editTitle,
} from "../controllers/notepadController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").get(protect, getMyNotes);
router.route("/").post(protect, addNotepad);
router.route("/").put(protect, updateNotepad);
router.route("/").delete(protect, removeNotepad);

router.route("/id").get(protect, findNoteById);

router.route("/resource").get(protect, getNotesByResource);
router.route("/project").get(protect, getNotesByProject);

router.route("/day").get(protect, getNotesByDay);

router.route("/edit/title").put(protect, editTitle);

export default router;
