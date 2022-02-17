import asyncHandler from "express-async-handler";
import Notepad from "../models/notePadModel.js";
import Project from "../models/projectModel.js";
import Resource from "../models/resourceModel.js";
import Exercise from "../models/exerciseModel.js";
import Quarter from "../models/quarterModel.js";
import Month from "../models/monthModel.js";
import Week from "../models/weekModel.js";
import Day from "../models/dayModel.js";
import Goal from "../models/goalModel.js";
import Transcript from "../models/transcriptModel.js";
import Subject from "../models/subjectModel.js";
import getTimelineUnitData from "../utils/getTimelineUnitData.js";
import getGoalsData from "../utils/getGoalsData.js";

const findNoteById = asyncHandler(async (req, res) => {
  const note = await Notepad.findOne({
    _id: req.headers.id,
    isRemoved: false,
  }).select("-user");

  res.json(note);
});

const getResourceData = asyncHandler(async (req, res) => {
  const { user, subjectId } = await Transcript.findOne(
    { _id: req.headers.transcriptid },
    "user subjectId"
  );

  let data = {};
  data.notes = await Notepad.find({
    resource: req.headers.resource,
    isRemoved: false,
  });

  data.goals = await Goal.find({
    resources: req.headers.resource,
    isRemoved: false,
  }).lean();

  await getGoalsData(data.goals, user, subjectId);

  res.json(data);
});

const getProjectData = asyncHandler(async (req, res) => {
  const { user, subjectId } = await Transcript.findOne(
    { _id: req.headers.transcriptid },
    "user subjectId"
  );

  let data = {};
  data.notes = await Notepad.find({
    project: req.headers.project,
    isRemoved: false,
  });

  data.goals = await Goal.find({
    projects: req.headers.project,
    isRemoved: false,
  }).lean();

  await getGoalsData(data.goals, user, subjectId);

  res.json(data);
});

const listSubjects = asyncHandler(async (req, res) => {
  const { user } = await Transcript.findOne(
    { _id: req.headers.transcriptid },
    "user"
  );

  const subjects = await Subject.find({ user: user, isPublic: true })
    .select("-user")
    .lean();

  await Promise.all(
    subjects.map(async (subject) => {
      const { _id } = await Transcript.findOne(
        { subjectId: subject._id },
        "_id"
      );
      subject.transcript = _id;
    })
  );

  res.json(subjects);
});

const getSubgoals = async (
  goal,
  unitProjects,
  unitBooks,
  unitExercises,
  user,
  subjectId,
  rec
) => {
  if (rec > 10000) {
    return null;
  }

  rec += 1;

  goal = await Goal.findOne({ _id: goal, isRemoved: false }).lean();

  let resources = [];
  await Promise.all(
    goal.resources.map(async (resource) => {
      resource = await Resource.findOne({
        user: user,
        subject: subjectId,
        _id: resource,
        isRemoved: false,
      });
      if (resource) {
        resources.push(resource);

        if (!unitBooks.some((e) => e._id === resource._id)) {
          unitBooks.push(resource);
        }
      }
    })
  );
  goal.resources = resources;

  let projects = [];
  await Promise.all(
    goal.projects.map(async (project) => {
      project = await Project.findOne({
        user: user,
        subject: subjectId,
        _id: project,
        isRemoved: false,
      });
      if (project) {
        projects.push(project);
        if (!unitProjects.some((e) => e._id === project._id)) {
          unitProjects.push(project);
        }
      }
    })
  );
  goal.projects = projects;

  let exercises = [];
  await Promise.all(
    goal.exercises.map(async (exercise) => {
      exercise = await Exercise.findOne({
        user: user,
        subject: subjectId,
        _id: exercise,
        isRemoved: false,
      });
      exercises.push(exercise);
      if (!unitExercises.some((e) => e._id === exercise._id)) {
        unitExericses.push(exercise);
      }
    })
  );
  goal.exercises = exercises;

  let subgoals = [];
  await Promise.all(
    goal.subgoals.map(async (subgoal) => {
      subgoal = await getSubgoals(
        subgoal,
        unitProjects,
        unitBooks,
        unitExercises,
        user,
        subjectId,
        rec
      );
      subgoals.push(subgoal);
    })
  );
  goal.subgoals = subgoals;

  return goal;
};

const getUnitData = asyncHandler(async (req, res) => {
  const { user, subjectId } = await Transcript.findOne(
    { _id: req.headers.transcriptid },
    "user subjectId"
  );

  let unit;

  if (req.headers.unit_type === "Day") {
    unit = await Day.findOne({
      user: user,
      subject: subjectId,
      number: req.headers.unit_number,
    }).lean();
  } else if (req.headers.unit_type === "Week") {
    unit = await Week.findOne({
      user: user,
      subject: subjectId,
      number: req.headers.unit_number,
    }).lean();
  } else if (req.headers.unit_type === "Month") {
    unit = await Month.findOne({
      user: user,
      subject: subjectId,
      number: req.headers.unit_number,
    }).lean();
  } else if (req.headers.unit_type === "Quarter") {
    unit = await Quarter.findOne({
      user: user,
      subject: subjectId,
      number: req.headers.unit_number,
    }).lean();
  }

  let unitProjects = [];
  let unitBooks = [];
  let unitExercises = [];

  let unitGoals = [];
  await Promise.all(
    unit.goals.map(async (goalId) => {
      const goal = await Goal.findOne({
        user: user,
        subject: subjectId,
        _id: goalId,
        isRemoved: false,
      });
      if (goal) {
        unitGoals.push(goal);

        let resources = [];
        await Promise.all(
          goal.resources.map(async (resourceId) => {
            let resource = await Resource.findOne({
              user: user,
              subject: subjectId,
              _id: resourceId,
              isRemoved: false,
            });
            if (resource) {
              resources.push(resource);
              if (!unitBooks.some((e) => e._id === resource._id)) {
                unitBooks.push(resource);
              }
            }
          })
        );
        goal.resources = resources;

        let projects = [];
        await Promise.all(
          goal.projects.map(async (projectId) => {
            let project = await Project.findOne({
              user: user,
              subject: subjectId,
              _id: projectId,
              isRemoved: false,
            });
            if (project) {
              projects.push(project);
              if (!unitProjects.some((e) => e._id === project._id)) {
                unitProjects.push(project);
              }
            }
          })
        );
        goal.projects = projects;

        let exercises = [];
        await Promise.all(
          goal.exercises.map(async (exerciseId) => {
            let exercise = await Exercise.findOne({
              user: user,
              subject: subjectId,
              _id: exerciseId,
              isRemoved: false,
            });
            exercises.push(exercise);
            if (!unitExercises.some((e) => e._id === exercise._id)) {
              unitExercises.push(exercise);
            }
          })
        );
        goal.exercises = exercises;

        let subgoals = [];
        await Promise.all(
          goal.subgoals.map(async (subgoal) => {
            subgoal = await getSubgoals(
              subgoal,
              unitProjects,
              unitBooks,
              unitExercises,
              user,
              subjectId,
              0
            );
            subgoals.push(subgoal);
          })
        );
        goal.subgoals = subgoals;
      }
    })
  );

  unit.goals = unitGoals;
  unit.projects = unitProjects;
  unit.books = unitBooks;
  unit.exercises = unitExercises;

  unit.notepad = await Notepad.findOne({ _id: unit.notepad });

  res.json(unit);
});

const getMonthsOfQuarter = asyncHandler(async (req, res) => {
  const { user, subjectId } = await Transcript.findOne(
    {
      _id: req.headers.transcriptid,
    },
    "user subjectId"
  );

  const quarterNumber = req.headers.number;

  const quarter = await Quarter.findOne({
    user: user,
    subject: subjectId,
    number: quarterNumber,
  });

  const months = await getTimelineUnitData(
    quarter.months,
    "month",
    user,
    subjectId
  );

  res.json(months);
});

const getWeeksOfMonth = asyncHandler(async (req, res) => {
  const { user, subjectId } = await Transcript.findOne(
    {
      _id: req.headers.transcriptid,
    },
    "user subjectId"
  );

  const monthNumber = req.headers.number;

  const month = await Month.findOne({
    user: user,
    subject: subjectId,
    number: monthNumber,
  });

  const weeks = await getTimelineUnitData(month.weeks, "week", user, subjectId);

  res.json(weeks);
});

const getDaysOfWeek = asyncHandler(async (req, res) => {
  const weekNumber = req.headers.number;
  const result = [];

  const { user, subjectId } = await Transcript.findOne(
    {
      _id: req.headers.transcriptid,
    },
    "user subjectId"
  );

  const week = await Week.findOne({
    user: user,
    subject: subjectId,
    number: weekNumber,
  });

  await Promise.all(
    week.days.map(async (dayNumber) => {
      const day = await Day.findOne({
        user: user,
        subject: subjectId,
        number: dayNumber,
      }).lean();
      if (day) {
        let dayGoals = [];

        let dayProjects = [];
        let dayBooks = [];
        let dayExercises = [];

        await Promise.all(
          day.goals.map(async (goalId) => {
            const goal = await Goal.findOne({
              user: user,
              subject: subjectId,
              _id: goalId,
              isRemoved: false,
            });
            if (goal) {
              dayGoals.push(goal);

              let resources = [];
              await Promise.all(
                goal.resources.map(async (resourceId) => {
                  let resource = await Resource.findOne({
                    user: user,
                    subject: subjectId,
                    _id: resourceId,
                    isRemoved: false,
                  });
                  if (resource) {
                    resources.push(resource);
                    dayBooks.push(resource);
                  }
                })
              );
              goal.resources = resources;

              let projects = [];
              await Promise.all(
                goal.projects.map(async (projectId) => {
                  let project = await Project.findOne({
                    user: user,
                    subject: subjectId,
                    _id: projectId,
                    isRemoved: false,
                  });
                  if (project) {
                    projects.push(project);
                    dayProjects.push(project);
                  }
                })
              );
              goal.projects = projects;

              let exercises = [];
              await Promise.all(
                goal.exercises.map(async (exerciseId) => {
                  let exercise = await Exercise.findOne({
                    user: user,
                    subject: subjectId,
                    _id: exerciseId,
                    isRemoved: false,
                  });
                  exercises.push(exercise);
                  dayExercises.push(exercise);
                })
              );

              goal.exercises = exercises;
            }
          })
        );

        day.goals = dayGoals;
        day.projects = dayProjects;
        day.books = dayBooks;
        day.exercises = dayExercises;

        result.push(day);
      }
    })
  );

  res.json(result);
});

export {
  findNoteById,
  getMonthsOfQuarter,
  getWeeksOfMonth,
  getDaysOfWeek,
  getResourceData,
  getProjectData,
  listSubjects,
  getUnitData,
};
