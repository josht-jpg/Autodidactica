import express from "express";
const router = express.Router();
import {
  findNoteById,
  getDaysOfWeek,
  getResourceData,
  getProjectData,
  listSubjects,
  getUnitData,
  getWeeksOfMonth,
  getMonthsOfQuarter,
} from "../controllers/publicController.js";

router.route("/notes/id").get(findNoteById);

router.route("/weeks/listDays").get(getDaysOfWeek);
router.route("/months/listWeeks").get(getWeeksOfMonth);
router.route("/quarters/listMonths").get(getMonthsOfQuarter);

router.route("/resources/data").get(getResourceData);

router.route("/projects/data").get(getProjectData);

router.route("/subjects").get(listSubjects);

router.route("/dashboard/unit").get(getUnitData);

export default router;
