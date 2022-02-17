import express from "express";
const router = express.Router();
import {
  addSubject,
  doesSubjectExist,
  listSubjects,
  updateCurrentSubject,
} from "../controllers/subjectController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").get(protect, listSubjects);
router.route("/").post(protect, addSubject);
router.route("/exists").get(protect, doesSubjectExist);
router.route("/update-current").put(protect, updateCurrentSubject);

export default router;
