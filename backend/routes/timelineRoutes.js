import express from "express";
const router = express.Router();
import asyncHandler from "express-async-handler";
import Day from "../models/dayModel.js";
import Week from "../models/weekModel.js";
import Month from "../models/monthModel.js";
import {
  getMyYears,
  getMyQuarters,
  getMyMonths,
  getMyWeeks,
  getMyDays,
  getSingleDay,
  getNumberOfDays,
  getDaysOfWeek,
  getWeeksOfMonth,
  getMonthsOfQuarter,
  editTimelineGoals,
  editDayTextData,
  editQuarterTitle,
  editQuarterDates,
  editMonthTitle,
  editMonthDates,
  editWeekTitle,
  editWeekDates,
  editDayTitle,
  insertTextToQuarter,
  insertImageToQuarterUpload,
  insertImageToQuarterEmbed,
  insertVideoToQuarter,
  insertLinkToQuarter,
  insertDividerToQuarter,
  editCaptionOnQuarter,
  removeElementFromQuarter,
  insertTextToMonth,
  insertImageToMonthUpload,
  insertImageToMonthEmbed,
  insertVideoToMonth,
  insertLinkToMonth,
  insertDividerToMonth,
  editCaptionOnMonth,
  removeElementFromMonth,
  insertTextToWeek,
  insertImageToWeekUpload,
  insertImageToWeekEmbed,
  insertVideoToWeek,
  insertLinkToWeek,
  insertDividerToWeek,
  editCaptionOnWeek,
  removeElementFromWeek,
  insertTextToDay,
  insertImageToDayUpload,
  insertImageToDayEmbed,
  insertVideoToDay,
  insertLinkToDay,
  insertDividerToDay,
  editCaptionOnDay,
  removeElementFromDay,
  getYearsWithQuarters,
  getQuartersWithMonths,
  getWeeksWithDays,
  getMonthsWithWeeks,
  getUnitData,
  listTitles,
  editDayDate,
  editWeekDate,
  editDayText,
  editWeekText,
  editMonthText,
  editQuarterText,
} from "../controllers/timelineController.js";
import {
  addDay,
  addWeek,
  addMonth,
  addQuarter,
  addYear,
} from "../controllers/addController.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const days = await Day.find({});
    const weeks = await Week.find({});

    res.json({ days, weeks });
  })
);

router.route("/months/listWeeks").get(protect, getWeeksOfMonth);
router.route("/quarters/listMonths").get(protect, getMonthsOfQuarter);
router.route("/weeks/listDays").get(protect, getDaysOfWeek);

router.route("/quarter/subunits").get(protect, getMonthsOfQuarter);
router.route("/month/subunits").get(protect, getWeeksOfMonth);
router.route("/week/subunits").get(protect, getDaysOfWeek);

router.route("/years").get(protect, getMyYears);
router.route("/years").post(protect, addYear);

router.route("/years/listWithQuarters").get(protect, getYearsWithQuarters);

router.route("/quarters/title").put(protect, editQuarterTitle);
router.route("/quarters/dates").post(protect, editQuarterDates);

router.route("/quarters").get(protect, getMyQuarters);
router.route("/quarters").post(protect, addQuarter);

router.route("/quarters/listWithMonths").get(protect, getQuartersWithMonths);

router.route("/months").get(protect, getMyMonths);

router.route("/months").post(protect, addMonth);

router.route("/months/listWithWeeks").get(protect, getMonthsWithWeeks);

router.route("/months/title").put(protect, editMonthTitle);
router.route("/months/dates").post(protect, editMonthDates);

router.get(
  "/months/:number",
  asyncHandler(async (req, res) => {
    const month = await Month.find({ number: req.params.id });
    if (month) {
      res.json(month);
    } else {
      res.status(404).json({ message: "Month Object Not Found" });
    }
  })
);

router.route("/weeks").get(protect, getMyWeeks);
router.route("/weeks").post(protect, addWeek);

router.route("/weeks/listWithDays").get(protect, getWeeksWithDays);

router.route("/weeks/title").put(protect, editWeekTitle);
router.route("/weeks/dates").post(protect, editWeekDates);

router.get(
  "/weeks/:number",
  asyncHandler(async (req, res) => {
    const week = await Week.find({
      user: req.user._id,
      number: req.params.number,
    });
    if (week) {
      res.json(week);
    } else {
      res.status(404).json({ message: "Week Object Not Found" });
    }
  })
);

router.route("/days").get(protect, getMyDays);

router.route("/days").post(protect, addDay);

router.route("/days/:number").get(protect, getSingleDay);

router.route("/days/count").get(protect, getNumberOfDays);

router.route("/days/text").put(protect, editDayTextData);

router.route("/days/title").put(protect, editDayTitle);

router.route("/timeline/goals").put(protect, editTimelineGoals);

router.route("/quarters/insert/text").post(protect, insertTextToQuarter);
router
  .route("/quarters/insert/image/upload")
  .post(protect, upload.single("file"), insertImageToQuarterUpload);
router
  .route("/quarters/insert/image/embed")
  .post(protect, insertImageToQuarterEmbed);
router.route("/quarters/insert/video").post(protect, insertVideoToQuarter);
router.route("/quarters/insert/link").post(protect, insertLinkToQuarter);
router.route("/quarters/insert/divider").post(protect, insertDividerToQuarter);

router.route("/quarters/edit/caption").put(protect, editCaptionOnQuarter);
router
  .route("/quarters/remove/element")
  .delete(protect, removeElementFromQuarter);

router.route("/months/insert/text").post(protect, insertTextToMonth);
router
  .route("/months/insert/image/upload")
  .post(protect, upload.single("file"), insertImageToMonthUpload);
router
  .route("/months/insert/image/embed")
  .post(protect, insertImageToMonthEmbed);
router.route("/months/insert/video").post(protect, insertVideoToMonth);
router.route("/months/insert/link").post(protect, insertLinkToMonth);
router.route("/months/insert/divider").post(protect, insertDividerToMonth);

router.route("/months/edit/caption").put(protect, editCaptionOnMonth);
router.route("/months/remove/element").delete(protect, removeElementFromMonth);

router.route("/weeks/insert/text").post(protect, insertTextToWeek);
router
  .route("/weeks/insert/image/upload")
  .post(protect, upload.single("file"), insertImageToWeekUpload);
router.route("/weeks/insert/image/embed").post(protect, insertImageToWeekEmbed);
router.route("/weeks/insert/video").post(protect, insertVideoToWeek);
router.route("/weeks/insert/link").post(protect, insertLinkToWeek);
router.route("/weeks/insert/divider").post(protect, insertDividerToWeek);

router.route("/weeks/edit/caption").put(protect, editCaptionOnWeek);
router.route("/weeks/remove/element").delete(protect, removeElementFromWeek);

router.route("/days/insert/text").post(protect, insertTextToDay);
router
  .route("/days/insert/image/upload")
  .put(protect, upload.single("file"), insertImageToDayUpload);
router.route("/days/insert/image/embed").post(protect, insertImageToDayEmbed);
router.route("/days/insert/video").post(protect, insertVideoToDay);
router.route("/days/insert/link").post(protect, insertLinkToDay);
router.route("/days/insert/divider").post(protect, insertDividerToDay);

router.route("/days/edit/caption").put(protect, editCaptionOnDay);
router.route("/days/remove/element").delete(protect, removeElementFromDay);

router.route("/unit").get(protect, getUnitData);
router.route("/titles").get(protect, listTitles);

router.route("/days/date").put(protect, editDayDate);
router.route("/weeks/date").put(protect, editWeekDate);

router.route("/daysScreen").get(protect, getWeeksWithDays);
router.route("/weeksScreen").get(protect, getMonthsWithWeeks);
router.route("/monthsScreen").get(protect, getQuartersWithMonths);
router.route("/quartersScreen").get(protect, getYearsWithQuarters);

router.route("/days/edit/text").put(protect, editDayText);
router.route("/weeks/edit/text").put(protect, editWeekText);
router.route("/months/edit/text").put(protect, editMonthText);
router.route("/quarters/edit/text").put(protect, editQuarterText);

export default router;
