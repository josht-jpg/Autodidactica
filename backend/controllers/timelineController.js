import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Goal from "../models/goalModel.js";
import Resource from "../models/resourceModel.js";
import Project from "../models/projectModel.js";
import Exercise from "../models/exerciseModel.js";
import Year from "../models/yearModel.js";
import Quarter from "../models/quarterModel.js";
import Month from "../models/monthModel.js";
import Week from "../models/weekModel.js";
import Day from "../models/dayModel.js";
import Notepad from "../models/notePadModel.js";
import createGoals from "../utils/createGoals.js";
import Transcript from "../models/transcriptModel.js";
import EditableElement from "../models/editableElementModel.js";
import uploadImage from "../utils/uploadImage.js";
import getTimelineUnitData from "../utils/getTimelineUnitData.js";
import sanitize from "mongo-sanitize";

const compareNumbers = (a, b) => {
  if (!a || !b) {
    return 0;
  }
  if (a.number < b.number) {
    return -1;
  }
  if (a.number > b.number) {
    return 1;
  }
  return 0;
};

const getSubgoal = async (goal, req) => {
  goal = await Goal.findOne({ _id: goal, isRemoved: false }).lean();

  let resources = [];
  await Promise.all(
    goal.resources.map(async (resource) => {
      resource = await Resource.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: resource,
        isRemoved: false,
      });
      if (resource) {
        resources.push(resource);
      }
    })
  );
  goal.resources = resources;

  let projects = [];
  await Promise.all(
    goal.projects.map(async (project) => {
      project = await Project.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: project,
        isRemoved: false,
      });
      if (project) {
        projects.push(project);
      }
    })
  );
  goal.projects = projects;

  let exercises = [];
  await Promise.all(
    goal.exercises.map(async (exercise) => {
      exercise = await Exercise.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: exercise,
        isRemoved: false,
      });
      exercises.push(exercise);
    })
  );
  goal.exercises = exercises;

  let subgoals = [];
  await Promise.all(
    goal.subgoals.map(async (subgoal) => {
      subgoal = await getSubgoal(subgoal, req);
      subgoals.push(subgoal);
    })
  );
  goal.subgoals = subgoals;

  return goal;
};

const getSubgoal_refined = async (goal, req) => {
  goal = await Goal.findOne({ _id: goal, isRemoved: false }).lean();

  let resources = [];
  await Promise.all(
    goal.resources.map(async (resource) => {
      resource = await Resource.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: resource,
        isRemoved: false,
      });
      if (resource) {
        resources.push(resource);
      }
    })
  );
  goal.resources = resources;

  let projects = [];
  await Promise.all(
    goal.projects.map(async (project) => {
      project = await Project.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: project,
        isRemoved: false,
      });
      if (project) {
        projects.push(project);
      }
    })
  );
  goal.projects = projects;

  let exercises = [];
  await Promise.all(
    goal.exercises.map(async (exercise) => {
      exercise = await Exercise.findOne({
        user: req.user._id,
        subject: req.headers.subject,
        _id: exercise,
        isRemoved: false,
      });
      exercises.push(exercise);
    })
  );
  goal.exercises = exercises;

  let subgoals = [];
  await Promise.all(
    goal.subgoals.map(async (subgoal) => {
      subgoal = await getSubgoal_refined(subgoal, req);
      subgoals.push(subgoal);
    })
  );
  goal.subgoals = subgoals;

  return goal;
};

const getSubgoal_refined_with_materials = async (
  goal,
  unitProjects,
  unitBooks,
  unitExercises,
  req
) => {
  goal = await Goal.findOne({ _id: goal, isRemoved: false }).lean();

  let resources = [];
  await Promise.all(
    goal.resources.map(async (resource) => {
      resource = await Resource.findOne({
        user: req.user._id,
        subject: req.headers.subject,
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
        user: req.user._id,
        subject: req.headers.subject,
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
        user: req.user._id,
        subject: req.headers.subject,
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
      subgoal = await getSubgoal_refined_with_materials(
        subgoal,
        unitProjects,
        unitBooks,
        unitExercises,
        req
      );
      subgoals.push(subgoal);
    })
  );
  goal.subgoals = subgoals;

  return goal;
};

const getMyYears = asyncHandler(async (req, res) => {
  let year = await Year.find({
    user: req.user._id,
    subject: req.headers.subject,
  }).lean();

  await Promise.all(
    year.map(async (year) => {
      let yearGoals = [];
      await Promise.all(
        year.goals.map(async (goalId) => {
          const goal = await Goal.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            _id: goalId,
            isRemoved: false,
          });
          if (goal) {
            yearGoals.push(goal);

            let resources = [];
            await Promise.all(
              goal.resources.map(async (resourceId) => {
                let resource = await Resource.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: resourceId,
                  isRemoved: false,
                });
                if (resource) {
                  resources.push(resource);
                }
              })
            );
            goal.resources = resources;

            let projects = [];
            await Promise.all(
              goal.projects.map(async (projectId) => {
                let project = await Project.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: projectId,
                  isRemoved: false,
                });
                if (project) {
                  projects.push(project);
                }
              })
            );
            goal.projects = projects;

            let exercises = [];
            await Promise.all(
              goal.exercises.map(async (exerciseId) => {
                let exercise = await Exercise.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: exerciseId,
                  isRemoved: false,
                });
                exercises.push(exercise);
              })
            );

            goal.exercises = exercises;
          }
        })
      );

      year.goals = yearGoals;
    })
  );
  res.json(year);
});

const getMyQuarters = asyncHandler(async (req, res) => {
  let quarter = await Quarter.find({
    user: req.user._id,
    subject: req.headers.subject,
  }).lean();

  await Promise.all(
    quarter.map(async (quarter) => {
      let quarterGoals = [];
      await Promise.all(
        quarter.goals.map(async (goalId) => {
          const goal = await Goal.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            _id: goalId,
            isRemoved: false,
          });
          if (goal) {
            quarterGoals.push(goal);

            let resources = [];
            await Promise.all(
              goal.resources.map(async (resourceId) => {
                let resource = await Resource.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: resourceId,
                  isRemoved: false,
                });
                if (resource) {
                  resources.push(resource);
                }
              })
            );
            goal.resources = resources;

            let projects = [];
            await Promise.all(
              goal.projects.map(async (projectId) => {
                let project = await Project.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: projectId,
                  isRemoved: false,
                });
                if (project) {
                  projects.push(project);
                }
              })
            );
            goal.projects = projects;

            let exercises = [];
            await Promise.all(
              goal.exercises.map(async (exerciseId) => {
                let exercise = await Exercise.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: exerciseId,
                  isRemoved: false,
                });
                exercises.push(exercise);
              })
            );

            goal.exercises = exercises;
          }
        })
      );

      quarter.goals = quarterGoals;
    })
  );
  res.json(quarter);
});

const getMyMonths = asyncHandler(async (req, res) => {
  let months = await Month.find({
    user: req.user._id,
    subject: req.headers.subject,
  }).lean();

  await getTimelineUnitData(months, "month", req.user._id, req.headers.subject);

  res.json(months);
});

const getMyWeeks = asyncHandler(async (req, res) => {
  let weeks = await Week.find({
    user: req.user._id,
    subject: req.headers.subject,
  }).lean();

  await Promise.all(
    weeks.map(async (week) => {
      let weekGoals = [];

      let weekProjects = [];
      let weekBooks = [];
      let weekExercises = [];
      await Promise.all(
        week.goals.map(async (goalId) => {
          const goal = await Goal.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            _id: goalId,
            isRemoved: false,
          });
          if (goal) {
            weekGoals.push(goal);

            let resources = [];
            await Promise.all(
              goal.resources.map(async (resourceId) => {
                let resource = await Resource.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: resourceId,
                  isRemoved: false,
                });
                if (resource) {
                  resources.push(resource);
                  weekBooks.push(resource);
                }
              })
            );
            goal.resources = resources;

            let projects = [];
            await Promise.all(
              goal.projects.map(async (projectId) => {
                let project = await Project.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: projectId,
                  isRemoved: false,
                });
                if (project) {
                  projects.push(project);
                  weekProjects.push(project);
                }
              })
            );
            goal.projects = projects;

            let exercises = [];
            await Promise.all(
              goal.exercises.map(async (exerciseId) => {
                let exercise = await Exercise.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: exerciseId,
                  isRemoved: false,
                });
                exercises.push(exercise);
                weekExercises.push(exercise);
              })
            );
            goal.exercises = exercises;

            let subgoals = [];
            await Promise.all(
              goal.subgoals.map(async (subgoal) => {
                //subgoal = await getSubgoal(subgoal, req);
                subgoal = await getSubgoal_refined_with_materials(
                  subgoal,
                  weekProjects,
                  weekBooks,
                  weekExercises,
                  req
                );
                subgoals.push(subgoal);
              })
            );
            goal.subgoals = subgoals;
          }
        })
      );
      week.goals = weekGoals;
      week.projects = weekProjects;
      week.books = weekBooks;
      week.exercises = weekExercises;
    })
  );

  res.json(weeks);
});

const getMyDays = asyncHandler(async (req, res) => {
  let days = await Day.find({
    user: req.user._id,
    subject: req.headers.subject,
  }).lean();

  await Promise.all(
    days.map(async (day) => {
      let dayGoals = [];
      await Promise.all(
        day.goals.map(async (goalId) => {
          const goal = await Goal.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            _id: goalId,
            isRemoved: false,
          });
          if (goal) {
            dayGoals.push(goal);

            let resources = [];
            await Promise.all(
              goal.resources.map(async (resourceId) => {
                let resource = await Resource.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: resourceId,
                  isRemoved: false,
                });
                if (resource) {
                  resources.push(resource);
                }
              })
            );
            goal.resources = resources;

            let projects = [];
            await Promise.all(
              goal.projects.map(async (projectId) => {
                let project = await Project.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: projectId,
                  isRemoved: false,
                });
                if (project) {
                  projects.push(project);
                }
              })
            );
            goal.projects = projects;

            let exercises = [];
            await Promise.all(
              goal.exercises.map(async (exerciseId) => {
                let exercise = await Exercise.findOne({
                  user: req.user._id,
                  subject: req.headers.subject,
                  _id: exerciseId,
                  isRemoved: false,
                });
                exercises.push(exercise);
              })
            );
            goal.exercises = exercises;

            let subgoals = [];
            await Promise.all(
              goal.subgoals.map(async (subgoal) => {
                subgoal = await getSubgoal_refined(subgoal, req);
                subgoals.push(subgoal);
              })
            );
            goal.subgoals = subgoals;
          }
        })
      );

      day.goals = dayGoals;
    })
  );

  res.json(days);
});

const getNumberOfDays = asyncHandler(async (req, res) => {
  const num = await Day.find({ user: req.user._id }).count({});
  res.json(num);
});

const getMonthsOfQuarter = asyncHandler(async (req, res) => {
  const quarterNumber = req.headers.number;

  const quarter = await Quarter.findOne({
    user: req.user._id,
    subject: req.headers.subject,
    number: quarterNumber,
  });

  const months = await getTimelineUnitData(
    quarter.months,
    "month",
    req.user._id,
    req.headers.subject
  );

  res.json(months);
});

const getWeeksOfMonth = asyncHandler(async (req, res) => {
  const monthNumber = req.headers.number;

  const month = await Month.findOne({
    user: req.user._id,
    subject: req.headers.subject,
    number: monthNumber,
  });

  const weeks = await getTimelineUnitData(
    month.weeks,
    "week",
    req.user._id,
    req.headers.subject
  );

  res.json(weeks);
});

const getDaysOfWeek = asyncHandler(async (req, res) => {
  const weekNumber = req.headers.number;
  const result = [];

  const week = await Week.findOne({
    user: req.user._id,
    subject: req.headers.subject,
    number: weekNumber,
  });

  await Promise.all(
    week.days.map(async (dayNumber) => {
      const day = await Day.findOne({
        user: req.user._id,
        subject: req.headers.subject,
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
              user: req.user._id,
              subject: req.headers.subject,
              _id: goalId,
              isRemoved: false,
            });
            if (goal) {
              dayGoals.push(goal);

              let resources = [];
              await Promise.all(
                goal.resources.map(async (resourceId) => {
                  let resource = await Resource.findOne({
                    user: req.user._id,
                    subject: req.headers.subject,
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
                    user: req.user._id,
                    subject: req.headers.subject,
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
                    user: req.user._id,
                    subject: req.headers.subject,
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

const getSingleDay = asyncHandler(async (req, res) => {
  const day = await Day.find({ user: req.user._id, number: req.params.number });
  if (day) {
    res.json(day[0]);
  } else {
    res.status(404).json({ message: "Day Object Not Found" });
  }
});

const editDayTextData = asyncHandler(async (req, res) => {
  const { data, type, id } = req.body;

  let update = {};
  if (type === "comments") {
    update = { comments: data };
  }

  const returnData = await Day.findOneAndUpdate(
    { user: req.user._id, subject: req.headers.subject, _id: id },
    update,
    updateOne
  );
  res.json(returnData);
});

const editTimelineGoals = asyncHandler(async (req, res) => {
  const { id, number, type, goals } = req.body;

  if (type === "day") {
    const goalIds = await createGoals(
      goals,
      req.user._id,
      req.headers.subject,
      number,
      "DAY"
    );

    var data = await Day.findOneAndUpdate(
      { user: req.user._id, subject: req.headers.subject, _id: id },
      { $push: { goals: goalIds } },
      { useFindAndModify: false }
    );
  } else if (type === "week") {
    const goalIds = await createGoals(
      goals,
      req.user._id,
      req.headers.subject,
      number,
      "WEEK"
    );

    var data = await Week.findOneAndUpdate(
      { user: req.user._id, subject: req.headers.subject, _id: id },
      { $push: { goals: goalIds } },
      { useFindAndModify: false }
    );

    if (data.goals.length === 0) {
      const transcript = await Transcript.findOne({
        user: req.user._id,
        subjectId: req.headers.subject,
      });
      await Transcript.updateOne(
        { _id: transcript._id },
        {
          $push: {
            weeks: { _id: data._id, orderIndex: transcript.weeks.length },
          },
        }
      );
    }
  } else if (type === "month") {
    const goalIds = await createGoals(
      goals,
      req.user._id,
      req.headers.subject,
      number,
      "MONTH"
    );

    var data = await Month.findOneAndUpdate(
      { user: req.user._id, subject: req.headers.subject, _id: id },
      { $push: { goals: goalIds } },
      { useFindAndModify: false }
    );

    if (data.goals.length === 0) {
      const transcript = await Transcript.findOne({
        user: req.user._id,
        subjectId: req.headers.subject,
      });
      await Transcript.updateOne(
        { _id: transcript._id },
        {
          $push: {
            months: { _id: data._id, orderIndex: transcript.months.length },
          },
        }
      );
    }
  } else if (type === "quarter") {
    const goalIds = await createGoals(
      goals,
      req.user._id,
      req.headers.subject,
      number,
      "QUARTER"
    );

    var data = await Quarter.findOneAndUpdate(
      { user: req.user._id, subject: req.headers.subject, _id: id },
      { $push: { goals: goalIds } },
      { useFindAndModify: false }
    );

    if (data.goals.length === 0) {
      const transcript = await Transcript.findOne({
        user: req.user._id,
        subjectId: req.headers.subject,
      });
      await Transcript.updateOne(
        { _id: transcript._id },
        {
          $push: {
            quarters: { _id: data._id, orderIndex: transcript.quarters.length },
          },
        }
      );
    }
  } /*else if (type === "year"){
        const goalIds = await createGoals(goals, req.user._id, req.headers.subject, number, "YEAR")

        var data = await Year.findOneAndUpdate(
            {user: req.user._id, subject: req.headers.subject, _id: id}, 
            {$push: {goals: goalIds}}, 
            {useFindAndModify: false})
    }*/

  res.json(data);
});

const editBegginingDate = async (date, type, number, userId, subjectId) => {
  if (number === 1) {
    if (type !== "day") {
      await Day.updateOne(
        { user: userId, subject: subjectId, number: 1 },
        { $set: { date: date } },
        { useFindAndModify: false }
      );
    }

    if (type !== "week") {
      await Week.updateOne(
        { user: userId, subject: subjectId, number: 1 },
        { $set: { date: date } },
        { useFindAndModify: false }
      );
    }

    if (type !== "month") {
      await Month.updateOne(
        { user: userId, subject: subjectId, number: 1 },
        { $set: { date: date } },
        { useFindAndModify: false }
      );
    }

    if (type !== "quater") {
      await Quarter.updateOne(
        { user: userId, subject: subjectId, number: 1 },
        { $set: { date: date } },
        { useFindAndModify: false }
      );
    }

    if (type !== "year") {
      await Year.updateOne(
        { user: userId, subject: subjectId, number: 1 },
        { $set: { date: date } },
        { useFindAndModify: false }
      );
    }
  }
};

const editQuarterTitle = asyncHandler(async (req, res) => {
  const { title, unitNumber } = req.body;

  await Quarter.updateOne(
    { user: req.user._id, subject: req.headers.subject, number: unitNumber },
    { $set: { title: sanitize(title) } },
    { useFindAndModify: false }
  );

  res.send(true);
});

const editQuarterDates = asyncHandler(async (req, res) => {
  const { date, _id } = req.body;

  await Quarter.updateOne(
    { _id: _id },
    { $set: { date: date } },
    { useFindAndModify: false }
  );

  res.send(true);
});

const editMonthTitle = asyncHandler(async (req, res) => {
  const { title, unitNumber } = req.body;

  await Month.updateOne(
    { _user: req.user._id, subject: req.headers.subject, number: unitNumber },
    { $set: { title: sanitize(title) } },
    { useFindAndModify: false }
  );

  res.send(true);
});

const editMonthDates = asyncHandler(async (req, res) => {
  const { date, _id } = req.body;

  await Month.updateOne(
    { _id: _id },
    { $set: { date: date } },
    { useFindAndModify: false }
  );

  res.send(true);
});

const editWeekTitle = asyncHandler(async (req, res) => {
  const { title, unitNumber } = req.body;

  await Week.updateOne(
    { user: req.user._id, subject: req.headers.subject, number: unitNumber },
    { $set: { title: sanitize(title) } },
    { useFindAndModify: false }
  );

  res.send(true);
});

const editWeekDates = asyncHandler(async (req, res) => {
  const { date, number, _id } = req.body;

  await Week.updateOne(
    { _id: _id },
    { $set: { date: date } },
    { useFindAndModify: false }
  );

  editBegginingDate(date, "week", number, req.user._id, req.headers.subject);

  res.send(true);
});

const editDayTitle = asyncHandler(async (req, res) => {
  const { title, unitNumber } = req.body;

  await Day.updateOne(
    { user: req.user._id, subject: req.headers.subject, number: unitNumber },
    { $set: { title: sanitize(title) } },
    { useFindAndModify: false }
  );

  res.status(201);
});

//Do more like this
const createNewTextElement = async (userId, subjectId) => {
  const newElement = await EditableElement.create({
    user: userId,
    subjectId: subjectId,
    _id: elementId,
    type: "TEXT",
    text: "",
  });
};

const insertTextToWeek = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "TEXT",
    text: "",
  });

  const week = await Week.findOne({ _id: materialId });
  const editableElements = [
    ...week.editableElements.slice(0, index),
    newElement,
    ...week.editableElements.slice(index),
  ];
  await Week.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertTextToMonth = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "TEXT",
    text: "",
  });

  const month = await Month.findOne({ _id: materialId });
  const editableElements = [
    ...month.editableElements.slice(0, index),
    newElement,
    ...month.editableElements.slice(index),
  ];
  await Month.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertTextToQuarter = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "TEXT",
    text: "",
  });

  const quarter = await Quarter.findOne({ _id: materialId });
  const editableElements = [
    ...quarter.editableElements.slice(0, index),
    newElement,
    ...quarter.editableElements.slice(index),
  ];
  await Quarter.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertImageToMonthUpload = asyncHandler(async (req, res) => {
  const file = req.file;
  let imageKey = mongoose.Types.ObjectId().toString();
  const isUploadSuccess = await uploadImage(file, imageKey);

  //if (isUploadSuccess) {
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: req.headers.elementid,
    type: "IMAGE",
    url: `https://primer-beta.s3.us-east-2.amazonaws.com/${imageKey}`, //ENV VARIABLE?
  });

  const month = await Month.findOne({ _id: req.headers.materialid });
  const editableElements = [
    ...month.editableElements.slice(0, req.headers.index),
    newElement,
    ...month.editableElements.slice(req.headers.index),
  ];

  await Month.updateOne(
    { _id: req.headers.materialid },
    { editableElements: editableElements }
  );
  //}
  res.json(true);
});

const insertImageToQuarterUpload = asyncHandler(async (req, res) => {
  const file = req.file;
  let imageKey = mongoose.Types.ObjectId().toString();
  const isUploadSuccess = await uploadImage(file, imageKey);

  //if (isUploadSuccess) {
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: req.headers.elementid,
    type: "IMAGE",
    url: `https://primer-beta.s3.us-east-2.amazonaws.com/${imageKey}`, //ENV VARIABLE?
  });

  const quarter = await Quarter.findOne({ _id: req.headers.materialid });
  const editableElements = [
    ...quarter.editableElements.slice(0, req.headers.index),
    newElement,
    ...quarter.editableElements.slice(req.headers.index),
  ];

  await Quarter.updateOne(
    { _id: req.headers.materialid },
    { editableElements: editableElements }
  );
  //}
  res.json(true);
});

const insertImageToWeekUpload = asyncHandler(async (req, res) => {
  const file = req.file;
  let imageKey = mongoose.Types.ObjectId().toString();
  const isUploadSuccess = await uploadImage(file, imageKey);

  //if (isUploadSuccess) {
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: req.headers.elementid,
    type: "IMAGE",
    url: `https://primer-beta.s3.us-east-2.amazonaws.com/${imageKey}`, //ENV VARIABLE?
  });

  const week = await Week.findOne({ _id: req.headers.materialid });
  const editableElements = [
    ...week.editableElements.slice(0, req.headers.index),
    newElement,
    ...week.editableElements.slice(req.headers.index),
  ];

  await Week.updateOne(
    { _id: req.headers.materialid },
    { editableElements: editableElements }
  );
  //}
  res.json(true);
});

const insertImageToWeekEmbed = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "IMAGE",
    url,
  });

  const week = await Week.findOne({ _id: materialId });
  const editableElements = [
    ...week.editableElements.slice(0, index),
    newElement,
    ...week.editableElements.slice(index),
  ];

  await Week.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertImageToMonthEmbed = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "IMAGE",
    url,
  });

  const month = await Month.findOne({ _id: materialId });
  const editableElements = [
    ...month.editableElements.slice(0, index),
    newElement,
    ...month.editableElements.slice(index),
  ];

  await Month.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertImageToQuarterEmbed = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "IMAGE",
    url,
  });

  const quarter = await Quarter.findOne({ _id: materialId });
  const editableElements = [
    ...quarter.editableElements.slice(0, index),
    newElement,
    ...quarter.editableElements.slice(index),
  ];

  await Quarter.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertVideoToWeek = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "VIDEO",
    url,
  });

  const week = await Week.findOne({ _id: materialId });
  const editableElements = [
    ...week.editableElements.slice(0, index),
    newElement,
    ...week.editableElements.slice(index),
  ];
  await Week.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertVideoToMonth = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "VIDEO",
    url,
  });

  const month = await Month.findOne({ _id: materialId });
  const editableElements = [
    ...month.editableElements.slice(0, index),
    newElement,
    ...month.editableElements.slice(index),
  ];
  await Month.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertVideoToQuarter = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "VIDEO",
    url,
  });

  const quarter = await Quarter.findOne({ _id: materialId });
  const editableElements = [
    ...quarter.editableElements.slice(0, index),
    newElement,
    ...quarter.editableElements.slice(index),
  ];
  await Quarter.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertLinkToWeek = asyncHandler(async (req, res) => {
  const { index, title, url, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "LINK",
    title,
    url,
  });

  const week = await Week.findOne({ _id: materialId });
  const editableElements = [
    ...week.editableElements.slice(0, index),
    newElement,
    ...week.editableElements.slice(index),
  ];
  await Week.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertLinkToMonth = asyncHandler(async (req, res) => {
  const { index, title, url, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "LINK",
    title,
    url,
  });

  const month = await Month.findOne({ _id: materialId });
  const editableElements = [
    ...month.editableElements.slice(0, index),
    newElement,
    ...month.editableElements.slice(index),
  ];
  await Month.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertLinkToQuarter = asyncHandler(async (req, res) => {
  const { index, title, url, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "LINK",
    title,
    url,
  });

  const quarter = await Quarter.findOne({ _id: materialId });
  const editableElements = [
    ...quarter.editableElements.slice(0, index),
    newElement,
    ...quarter.editableElements.slice(index),
  ];
  await Quarter.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertDividerToWeek = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "DIVIDER",
  });

  const week = await Week.findOne({ _id: materialId });
  const editableElements = [
    ...week.editableElements.slice(0, index),
    newElement,
    ...week.editableElements.slice(index),
  ];
  await Week.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertDividerToMonth = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "DIVIDER",
  });

  const month = await Month.findOne({ _id: materialId });
  const editableElements = [
    ...month.editableElements.slice(0, index),
    newElement,
    ...month.editableElements.slice(index),
  ];
  await Month.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertDividerToQuarter = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "DIVIDER",
  });

  const quarter = await Quarter.findOne({ _id: materialId });
  const editableElements = [
    ...quarter.editableElements.slice(0, index),
    newElement,
    ...quarter.editableElements.slice(index),
  ];
  await Quarter.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const editCaptionOnWeek = asyncHandler(async (req, res) => {
  const { caption, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { caption: caption });

  //change -- definitely change

  const week = await Week.findOne({ _id: materialId }).lean();
  for (const element of week.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.caption = caption;
    }

    await Week.updateOne(
      { _id: materialId },
      { editableElements: week.editableElements }
    );
  }

  res.json(true);
});

const removeElementFromWeek = asyncHandler(async (req, res) => {
  await Week.updateOne(
    { _id: req.headers.materialid },
    {
      $pull: {
        editableElements: {
          _id: mongoose.Types.ObjectId(req.headers.elementid),
        },
      },
    },
    { safe: true }
  );

  res.json(true);
});

const editCaptionOnMonth = asyncHandler(async (req, res) => {
  const { caption, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { caption: caption });

  //change -- definitely change

  const month = await Month.findOne({ _id: materialId }).lean();
  for (const element of month.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.caption = caption;
    }

    await Month.updateOne(
      { _id: materialId },
      { editableElements: month.editableElements }
    );
  }

  res.json(true);
});

const removeElementFromMonth = asyncHandler(async (req, res) => {
  await Month.updateOne(
    { _id: req.headers.materialid },
    {
      $pull: {
        editableElements: {
          _id: mongoose.Types.ObjectId(req.headers.elementid),
        },
      },
    },
    { safe: true }
  );

  res.json(true);
});

const editCaptionOnQuarter = asyncHandler(async (req, res) => {
  const { caption, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { caption: caption });

  //change -- definitely change

  const quarter = await Quarter.findOne({ _id: materialId }).lean();
  for (const element of quarter.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.caption = caption;
    }

    await Quarter.updateOne(
      { _id: materialId },
      { editableElements: quarter.editableElements }
    );
  }

  res.json(true);
});

const removeElementFromQuarter = asyncHandler(async (req, res) => {
  await Quarter.updateOne(
    { _id: req.headers.materialid },
    {
      $pull: {
        editableElements: {
          _id: mongoose.Types.ObjectId(req.headers.elementid),
        },
      },
    },
    { safe: true }
  );

  res.json(true);
});

const insertTextToDay = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "TEXT",
    text: "",
  });

  const day = await Day.findOne({ _id: materialId });
  const editableElements = [
    ...day.editableElements.slice(0, index),
    newElement,
    ...day.editableElements.slice(index),
  ];
  await Day.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertImageToDayUpload = asyncHandler(async (req, res) => {
  const file = req.file;
  let imageKey = mongoose.Types.ObjectId().toString();
  const isUploadSuccess = await uploadImage(file, imageKey);

  //if (isUploadSuccess) {
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: req.headers.elementid,
    type: "IMAGE",
    url: `https://primer-beta.s3.us-east-2.amazonaws.com/${imageKey}`, //ENV VARIABLE?
  });

  const day = await Day.findOne({ _id: req.headers.materialid });
  const editableElements = [
    ...day.editableElements.slice(0, req.headers.index),
    newElement,
    ...day.editableElements.slice(req.headers.index),
  ];

  await Day.updateOne(
    { _id: req.headers.materialid },
    { editableElements: editableElements }
  );
  //}
  res.json(true);
});

const insertImageToDayEmbed = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "IMAGE",
    url,
  });

  const day = await Day.findOne({ _id: materialId });
  const editableElements = [
    ...day.editableElements.slice(0, index),
    newElement,
    ...day.editableElements.slice(index),
  ];

  await Day.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertVideoToDay = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "VIDEO",
    url,
  });

  const day = await Day.findOne({ _id: materialId });
  const editableElements = [
    ...day.editableElements.slice(0, index),
    newElement,
    ...day.editableElements.slice(index),
  ];
  await Day.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertLinkToDay = asyncHandler(async (req, res) => {
  const { index, title, url, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "LINK",
    title,
    url,
  });

  const day = await Day.findOne({ _id: materialId });
  const editableElements = [
    ...day.editableElements.slice(0, index),
    newElement,
    ...day.editableElements.slice(index),
  ];
  await Day.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertDividerToDay = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "DIVIDER",
  });

  const day = await Day.findOne({ _id: materialId });
  const editableElements = [
    ...day.editableElements.slice(0, index),
    newElement,
    ...day.editableElements.slice(index),
  ];
  await Day.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const editCaptionOnDay = asyncHandler(async (req, res) => {
  const { caption, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { caption: caption });

  //change -- definitely change

  const day = await Day.findOne({ _id: materialId }).lean();
  for (const element of day.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.caption = caption;
    }

    await Day.updateOne(
      { _id: materialId },
      { editableElements: day.editableElements }
    );
  }

  res.json(true);
});

const removeElementFromDay = asyncHandler(async (req, res) => {
  await Day.updateOne(
    { _id: req.headers.materialid },
    {
      $pull: {
        editableElements: {
          _id: mongoose.Types.ObjectId(req.headers.elementid),
        },
      },
    },
    { safe: true }
  );

  res.json(true);
});

const getYearsWithQuarters = asyncHandler(async (req, res) => {
  let years = await Year.find({
    user: req.user._id,
    subject: req.headers.subject,
    "quarters.0": { $exists: true },
  }).lean();

  await Promise.all(
    years.map(async (year) => {
      year.quarters = await getTimelineUnitData(
        year.quarters,
        "quarter",
        req.user._id,
        req.headers.subject
      );
    })
  );

  res.json(years);
});

const getQuartersWithMonths = asyncHandler(async (req, res) => {
  let quarters = await Quarter.find({
    user: req.user._id,
    subject: req.headers.subject,
    "months.0": { $exists: true },
  }).lean();

  await Promise.all(
    quarters.map(async (quarter) => {
      quarter.months = await getTimelineUnitData(
        quarter.months,
        "month",
        req.user._id,
        req.headers.subject
      );
    })
  );

  res.json(quarters);
});

//---------
const getMonthsWithWeeks = asyncHandler(async (req, res) => {
  let months = await Month.find({
    user: req.user._id,
    subject: req.headers.subject,
    "weeks.0": { $exists: true },
  }).lean();

  await Promise.all(
    months.map(async (month) => {
      let weeks = [];

      await Promise.all(
        month.weeks.map(async (weekNumber) => {
          const week = await Week.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            number: weekNumber,
          }).lean();

          let weekGoals = [];
          let weekProjects = [];
          let weekBooks = [];
          let weekExercises = [];
          await Promise.all(
            week.goals.map(async (goalId) => {
              const goal = await Goal.findOne({
                user: req.user._id,
                subject: req.headers.subject,
                _id: goalId,
                isRemoved: false,
              });
              if (goal) {
                weekGoals.push(goal);

                let resources = [];
                await Promise.all(
                  goal.resources.map(async (resourceId) => {
                    let resource = await Resource.findOne({
                      user: req.user._id,
                      subject: req.headers.subject,
                      _id: resourceId,
                      isRemoved: false,
                    });
                    if (resource) {
                      resources.push(resource);
                      if (!weekBooks.some((e) => e._id === resource._id)) {
                        weekBooks.push(resource);
                      }
                    }
                  })
                );
                goal.resources = resources;

                let projects = [];
                await Promise.all(
                  goal.projects.map(async (projectId) => {
                    let project = await Project.findOne({
                      user: req.user._id,
                      subject: req.headers.subject,
                      _id: projectId,
                      isRemoved: false,
                    });
                    if (project) {
                      projects.push(project);
                      if (!weekProjects.some((e) => e._id === project._id)) {
                        weekProjects.push(project);
                      }
                    }
                  })
                );
                goal.projects = projects;

                let exercises = [];
                await Promise.all(
                  goal.exercises.map(async (exerciseId) => {
                    let exercise = await Exercise.findOne({
                      user: req.user._id,
                      subject: req.headers.subject,
                      _id: exerciseId,
                      isRemoved: false,
                    });
                    exercises.push(exercise);
                    if (!weekExercises.some((e) => e._id === exercise._id)) {
                      weekExercises.push(exercise);
                    }
                  })
                );
                goal.exercises = exercises;

                let subgoals = [];
                await Promise.all(
                  goal.subgoals.map(async (subgoal) => {
                    subgoal = await getSubgoal_refined_with_materials(
                      subgoal,
                      weekProjects,
                      weekBooks,
                      weekExercises,
                      req
                    );
                    subgoals.push(subgoal);
                  })
                );
                goal.subgoals = subgoals;
              }
            })
          );

          week.goals = weekGoals;
          week.projects = weekProjects;
          week.books = weekBooks;
          week.exercises = weekExercises;

          weeks.push(week);
        })
      );

      month.weeks = weeks;
    })
  );

  res.json(months);
});

const getWeeksWithDays = asyncHandler(async (req, res) => {
  let weeks = await Week.find({
    user: req.user._id,
    subject: req.headers.subject,
    "days.0": { $exists: true },
  }).lean();

  weeks = await getTimelineUnitData(
    weeks,
    "week",
    req.user._id,
    req.headers.subject
  );

  await Promise.all(
    weeks.map(async (week) => {
      let days = [];

      await Promise.all(
        week.days.map(async (dayNumber) => {
          const day = await Day.findOne({
            user: req.user._id,
            subject: req.headers.subject,
            number: dayNumber,
          }).lean();

          let dayGoals = [];
          let dayProjects = [];
          let dayBooks = [];
          let dayExercises = [];
          await Promise.all(
            day.goals.map(async (goalId) => {
              const goal = await Goal.findOne({
                user: req.user._id,
                subject: req.headers.subject,
                _id: goalId,
                isRemoved: false,
              });
              if (goal) {
                dayGoals.push(goal);

                let resources = [];
                await Promise.all(
                  goal.resources.map(async (resourceId) => {
                    let resource = await Resource.findOne({
                      user: req.user._id,
                      subject: req.headers.subject,
                      _id: resourceId,
                      isRemoved: false,
                    });
                    if (resource) {
                      resources.push(resource);
                      if (!dayBooks.some((e) => e._id === resource._id)) {
                        dayBooks.push(resource);
                      }
                    }
                  })
                );
                goal.resources = resources;

                let projects = [];
                await Promise.all(
                  goal.projects.map(async (projectId) => {
                    let project = await Project.findOne({
                      user: req.user._id,
                      subject: req.headers.subject,
                      _id: projectId,
                      isRemoved: false,
                    });
                    if (project) {
                      projects.push(project);
                      if (!dayProjects.some((e) => e._id === project._id)) {
                        dayProjects.push(project);
                      }
                    }
                  })
                );
                goal.projects = projects;

                let exercises = [];
                await Promise.all(
                  goal.exercises.map(async (exerciseId) => {
                    let exercise = await Exercise.findOne({
                      user: req.user._id,
                      subject: req.headers.subject,
                      _id: exerciseId,
                      isRemoved: false,
                    });
                    exercises.push(exercise);
                    if (!dayExercises.some((e) => e._id === exercise._id)) {
                      dayExercises.push(exercise);
                    }
                  })
                );
                goal.exercises = exercises;

                let subgoals = [];
                await Promise.all(
                  goal.subgoals.map(async (subgoal) => {
                    subgoal = await getSubgoal_refined_with_materials(
                      subgoal,
                      dayProjects,
                      dayBooks,
                      dayExercises,
                      req
                    );
                    subgoals.push(subgoal);
                  })
                );
                goal.subgoals = subgoals;
              }
            })
          );

          day.goals = dayGoals;
          day.projects = dayProjects;
          day.books = dayBooks;
          day.exercises = dayExercises;

          days.push(day);
        })
      );

      week.days = days;
    })
  );

  weeks = weeks.sort(compareNumbers);

  res.json(weeks);
});

const getUnitData = asyncHandler(async (req, res) => {
  let unit;

  if (req.headers.unit_type === "Day") {
    unit = await Day.findOne({
      user: req.user._id,
      subject: req.headers.subject,
      number: req.headers.unit_number,
    }).lean();
  } else if (req.headers.unit_type === "Week") {
    unit = await Week.findOne({
      user: req.user._id,
      subject: req.headers.subject,
      number: req.headers.unit_number,
    }).lean();
  } else if (req.headers.unit_type === "Month") {
    unit = await Month.findOne({
      user: req.user._id,
      subject: req.headers.subject,
      number: req.headers.unit_number,
    }).lean();
  } else if (req.headers.unit_type === "Quarter") {
    unit = await Quarter.findOne({
      user: req.user._id,
      subject: req.headers.subject,
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
        user: req.user._id,
        subject: req.headers.subject,
        _id: goalId,
        isRemoved: false,
      });
      if (goal) {
        unitGoals.push(goal);

        let resources = [];
        await Promise.all(
          goal.resources.map(async (resourceId) => {
            let resource = await Resource.findOne({
              user: req.user._id,
              subject: req.headers.subject,
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
              user: req.user._id,
              subject: req.headers.subject,
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
              user: req.user._id,
              subject: req.headers.subject,
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
            subgoal = await getSubgoal_refined_with_materials(
              subgoal,
              unitProjects,
              unitBooks,
              unitExercises,
              req
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

const listTitles = asyncHandler(async (req, res) => {
  let titles = { days: [], weeks: [], months: [], quarters: [], years: [] };

  titles.days = await Day.find({
    user: req.user._id,
    subject: req.headers.subject,
  }).select("title number");

  titles.weeks = await Week.find({
    user: req.user._id,
    subject: req.headers.subject,
  }).select("title number");

  titles.months = await Month.find({
    user: req.user._id,
    subject: req.headers.subject,
  }).select("title number");

  res.json(titles);
});

const decrementEverything = async (userId, subjectId, gap) => {
  const days = await Day.find({
    user: userId,
    subject: subjectId,
    number: {
      $gt: 1,
    },
  });

  await Promise.all(
    await days.map(async (day) => {
      let dateCopy = new Date(day.date);
      let previousDateCopy = day.previousDate && new Date(day.previousDate);
      let nextDateCopy = day.nextDate && new Date(day.nextDate);

      await Day.updateOne(
        { _id: day._id },
        {
          date: dateCopy.setDate(dateCopy.getDate() - gap),
          previousDate:
            previousDateCopy &&
            previousDateCopy.setDate(previousDateCopy.getDate() - gap),
          nextDate:
            nextDateCopy && nextDateCopy.setDate(nextDateCopy.getDate() - gap),
        }
      );
    })
  );

  const weeks = await Week.find({ user: userId, subject: subjectId });

  await Promise.all(
    weeks.map(async (week) => {
      let dateCopy = new Date(week.date);

      await Week.updateOne(
        { _id: week._id },
        {
          date: dateCopy && dateCopy.setDate(dateCopy.getDate() - gap),
        }
      );
    })
  );

  const months = await Month.find({ user: userId, subject: subjectId });

  await Promise.all(
    months.map(async (month) => {
      let dateCopy = new Date(month.date);

      await Month.updateOne(
        { _id: month._id },
        {
          date: dateCopy && dateCopy.setDate(dateCopy.getDate() - gap),
        }
      );
    })
  );

  const quarters = await Quarter.find({ user: userId, subject: subjectId });

  await Promise.all(
    quarters.map(async (quarter) => {
      let dateCopy = new Date(quarter.date);

      await Quarter.updateOne(
        { _id: quarter._id },
        {
          date: dateCopy && dateCopy.setDate(dateCopy.getDate() - gap),
        }
      );
    })
  );
};

const editDayDate = asyncHandler(async (req, res) => {
  let { date, unitNumber } = req.body;

  const day = await Day.findOne({
    user: req.user._id,
    subject: req.headers.subject,
    number: unitNumber,
  });

  const unitId = day._id;

  let dateCopy = new Date(date);
  const oldDateCopy = new Date(day.date);

  if (day.number === 1 && dateCopy < oldDateCopy) {
    const diffTime = Math.abs(
      oldDateCopy.setHours(0, 0, 0, 0) - dateCopy.setHours(0, 0, 0, 0)
    );
    const gap = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let nextDateCopy = day.nextDate && new Date(day.nextDate);
    await Day.updateOne(
      { user: req.user._id, subject: req.headers.subject, number: unitNumber },
      {
        date: date,
        nextDate:
          nextDateCopy && nextDateCopy.setDate(nextDateCopy.getDate() - gap),
      }
    );

    if (dateCopy < oldDateCopy) {
      await decrementEverything(req.user._id, req.headers.subject, gap);
    }
  } else {
    if (day.previousDate) {
      let previousDate = day.previousDate && new Date(day.previousDate);

      let previousDiffTime = Math.abs(
        dateCopy.setHours(0, 0, 0, 0) - previousDate.setHours(0, 0, 0, 0)
      );
      let previousDateGap = Math.ceil(
        previousDiffTime / (1000 * 60 * 60 * 24) - 1
      );
      await Day.updateOne(
        { user: req.user._id, subject: req.headers.subject, _id: unitId },
        { date: date, dateGap: previousDateGap }
      );
    } else {
      await Day.updateOne(
        { user: req.user._id, subject: req.headers.subject, _id: unitId },
        { date: date }
      );
    }

    const nextDay = await Day.findOne({
      user: req.user._id,
      subject: req.headers.subject,
      number: day.number + 1,
    });
    if (nextDay) {
      let nextDateCopy = new Date(nextDay.date);
      let nextDiffTime = Math.abs(
        nextDateCopy.setHours(0, 0, 0, 0) - dateCopy.setHours(0, 0, 0, 0)
      );
      let nextDateGap = Math.ceil(nextDiffTime / (1000 * 60 * 60 * 24)) - 1;

      await Day.updateOne(
        {
          user: req.user._id,
          subject: req.headers.subject,
          _id: nextDay._id,
        },
        { previousDate: date, dateGap: nextDateGap }
      );
    }

    const previousDay = await Day.findOne({
      user: req.user._id,
      subject: req.headers.subject,
      number: day.number - 1,
    });
    if (previousDay) {
      await Day.updateOne(
        {
          user: req.user._id,
          subject: req.headers.subject,
          _id: previousDay._id,
        },
        { nextDate: date }
      );
    }

    if (day.isFirstOfWeek) {
      if (dateCopy > oldDateCopy) {
        await Week.updateOne(
          {
            user: req.user._id,
            subject: req.headers.subject,
            days: day.number,
          },
          { date: dateCopy }
        );
      } else {
        const week = await Week.findOne({
          user: req.user._id,
          subject: req.headers.subject,
          days: day.number,
        });

        const previousWeek = await Week.findOne({
          user: req.user._id,
          subject: req.headers.subject,
          number: week.number - 1,
        });

        let previousWeekDate = new Date(previousWeek.date);

        if (
          previousWeekDate.setDate(previousWeekDate.getDate() + 7) > dateCopy
        ) {
          await Week.updateOne(
            {
              user: req.user._id,
              subject: req.headers.subject,
              _id: week._id,
            },
            {
              $pull: { days: day.number },
              date: nextDay ? nextDay.date : week.date,
            }
          );

          await Week.updateOne(
            {
              user: req.user._id,
              subject: req.headers.subject,
              _id: previousWeek._id,
            },
            { $push: { days: day.number } }
          );

          await Day.updateOne(
            {
              user: req.user._id,
              subject: req.headers.subject,
              _id: day._id,
            },
            { isFirstOfWeek: false }
          );

          await Day.updateOne(
            {
              user: req.user._id,
              subject: req.headers.subject,
              number: day.number + 1,
            },
            { isFirstOfWeek: true }
          );
        } else {
          //Decrement everything in the week
          let diffTime = Math.abs(
            oldDateCopy.setHours(0, 0, 0, 0) - dateCopy.setHours(0, 0, 0, 0)
          );
          let gap = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          let nextDateUpdate;
          await Promise.all(
            await week.days.slice(1).map(async (day, index) => {
              day = await Day.findOne({
                user: req.user._id,
                subject: req.headers.subject,
                number: day,
              });

              let dateOfWeekCopy = new Date(day.date);
              let previousDateCopy =
                day.previousDate && new Date(day.previousDate);
              let nextDateCopy = day.nextDate && new Date(day.nextDate);

              dateOfWeekCopy.setDate(dateOfWeekCopy.getDate() - gap);
              if (index === 0) {
                nextDateUpdate = dateOfWeekCopy;
              }

              if (previousDateCopy && index !== 0) {
                previousDateCopy.setDate(previousDateCopy.getDate() - gap);
              }

              //Check this
              if (nextDateCopy) {
                let weekRange = new Date(week.date);
                weekRange.setDate(weekRange.getDate() + 7);

                if (nextDateCopy < weekRange) {
                  nextDateCopy.setDate(nextDateCopy.getDate() - gap /* - 1? */);
                }
              }

              let firstGap;
              if (index === 0) {
                let diffTime = Math.abs(
                  dateOfWeekCopy.setHours(0, 0, 0, 0) -
                    dateCopy.setHours(0, 0, 0, 0)
                );
                firstGap = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
              }

              await Day.updateOne(
                { _id: day._id },
                {
                  date: dateOfWeekCopy,
                  previousDate: previousDateCopy,
                  nextDate: nextDateCopy,
                  dateGap: index === 0 ? firstGap : day.dateGap,
                }
              );

              //TO DO: update the next day's previous day if index is max -------------
            })
          );
          await Day.updateOne({ _id: day._id }, { nextDate: nextDateUpdate });
          await Week.updateOne({ _id: week._id }, { date: dateCopy });
        }
      }
    }
  }
  res.json(true);
});

const editWeekDate = asyncHandler(async (req, res) => {
  let { date, unitId } = req.body;

  const day = await Day.findOne({
    user: req.user._id,
    subject: req.headers.subject,
    _id: unitId,
  });

  let dateCopy = new Date(date);
  const oldDateCopy = new Date(day.date);

  if (day.number === 1 && dateCopy < oldDateCopy) {
    const diffTime = Math.abs(
      oldDateCopy.setHours(0, 0, 0, 0) - dateCopy.setHours(0, 0, 0, 0)
    );
    const gap = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let nextDateCopy = day.nextDate && new Date(day.nextDate);
    await Day.updateOne(
      { user: req.user._id, subject: req.headers.subject, _id: unitId },
      {
        date: date,
        nextDate:
          nextDateCopy && nextDateCopy.setDate(nextDateCopy.getDate() - gap),
      }
    );

    if (dateCopy < oldDateCopy) {
      await decrementEverything(req.user._id, req.headers.subject, gap);
    }
  } else {
    if (day.previousDate) {
      let previousDate = day.previousDate && new Date(day.previousDate);

      let previousDiffTime = Math.abs(
        dateCopy.setHours(0, 0, 0, 0) - previousDate.setHours(0, 0, 0, 0)
      );
      let previousDateGap = Math.ceil(
        previousDiffTime / (1000 * 60 * 60 * 24) - 1
      );
      await Day.updateOne(
        { user: req.user._id, subject: req.headers.subject, _id: unitId },
        { date: date, dateGap: previousDateGap }
      );
    } else {
      await Day.updateOne(
        { user: req.user._id, subject: req.headers.subject, _id: unitId },
        { date: date }
      );
    }

    const nextDay = await Day.findOne({
      user: req.user._id,
      subject: req.headers.subject,
      number: day.number + 1,
    });
    if (nextDay) {
      let nextDateCopy = new Date(nextDay.date);
      let nextDiffTime = Math.abs(
        nextDateCopy.setHours(0, 0, 0, 0) - dateCopy.setHours(0, 0, 0, 0)
      );
      let nextDateGap = Math.ceil(nextDiffTime / (1000 * 60 * 60 * 24)) - 1;

      await Day.updateOne(
        {
          user: req.user._id,
          subject: req.headers.subject,
          _id: nextDay._id,
        },
        { previousDate: date, dateGap: nextDateGap }
      );
    }

    const previousDay = await Day.findOne({
      user: req.user._id,
      subject: req.headers.subject,
      number: day.number - 1,
    });
    if (previousDay) {
      await Day.updateOne(
        {
          user: req.user._id,
          subject: req.headers.subject,
          _id: previousDay._id,
        },
        { nextDate: date }
      );
    }

    if (day.isFirstOfWeek) {
      if (dateCopy > oldDateCopy) {
        await Week.updateOne(
          {
            user: req.user._id,
            subject: req.headers.subject,
            days: day.number,
          },
          { date: dateCopy }
        );
      } else {
        const week = await Week.findOne({
          user: req.user._id,
          subject: req.headers.subject,
          days: day.number,
        });

        const previousWeek = await Week.findOne({
          user: req.user._id,
          subject: req.headers.subject,
          number: week.number - 1,
        });

        let previousWeekDate = new Date(previousWeek.date);

        if (
          previousWeekDate.setDate(previousWeekDate.getDate() + 7) > dateCopy
        ) {
          await Week.updateOne(
            {
              user: req.user._id,
              subject: req.headers.subject,
              _id: week._id,
            },
            {
              $pull: { days: day.number },
              date: nextDay ? nextDay.date : week.date,
            }
          );

          await Week.updateOne(
            {
              user: req.user._id,
              subject: req.headers.subject,
              _id: previousWeek._id,
            },
            { $push: { days: day.number } }
          );

          await Day.updateOne(
            {
              user: req.user._id,
              subject: req.headers.subject,
              _id: day._id,
            },
            { isFirstOfWeek: false }
          );

          await Day.updateOne(
            {
              user: req.user._id,
              subject: req.headers.subject,
              number: day.number + 1,
            },
            { isFirstOfWeek: true }
          );
        } else {
          //Decrement everything in the week
          let diffTime = Math.abs(
            oldDateCopy.setHours(0, 0, 0, 0) - dateCopy.setHours(0, 0, 0, 0)
          );
          let gap = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          let nextDateUpdate;
          await Promise.all(
            await week.days.slice(1).map(async (day, index) => {
              day = await Day.findOne({
                user: req.user._id,
                subject: req.headers.subject,
                number: day,
              });

              let dateOfWeekCopy = new Date(day.date);
              let previousDateCopy =
                day.previousDate && new Date(day.previousDate);
              let nextDateCopy = day.nextDate && new Date(day.nextDate);

              dateOfWeekCopy.setDate(dateOfWeekCopy.getDate() - gap);
              if (index === 0) {
                nextDateUpdate = dateOfWeekCopy;
              }

              if (previousDateCopy && index !== 0) {
                previousDateCopy.setDate(previousDateCopy.getDate() - gap);
              }

              //Check this
              if (nextDateCopy) {
                let weekRange = new Date(week.date);
                weekRange.setDate(weekRange.getDate() + 7);

                if (nextDateCopy < weekRange) {
                  nextDateCopy.setDate(nextDateCopy.getDate() - gap /* - 1? */);
                }
              }

              let firstGap;
              if (index === 0) {
                let diffTime = Math.abs(
                  dateOfWeekCopy.setHours(0, 0, 0, 0) -
                    dateCopy.setHours(0, 0, 0, 0)
                );
                firstGap = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;
              }

              await Day.updateOne(
                { _id: day._id },
                {
                  date: dateOfWeekCopy,
                  previousDate: previousDateCopy,
                  nextDate: nextDateCopy,
                  dateGap: index === 0 ? firstGap : day.dateGap,
                }
              );

              //TO DO: update the next day's previous day if index is max -------------
            })
          );
          await Day.updateOne({ _id: day._id }, { nextDate: nextDateUpdate });
          await Week.updateOne({ _id: week._id }, { date: dateCopy });
        }
      }
    }
  }
  res.json(true);
});

const editDayText = asyncHandler(async (req, res) => {
  const { text, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { text: sanitize(text) });

  //change -- definitely change
  const day = await Day.findOne({ _id: materialId }).lean();
  for (const element of day.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.text = text;
    }
  }
  await Day.updateOne(
    { _id: materialId },
    { editableElements: day.editableElements }
  );

  res.json(true);
});

const editQuarterText = asyncHandler(async (req, res) => {
  const { text, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { text: sanitize(text) });

  //change -- definitely change
  const quarter = await Quarter.findOne({ _id: materialId }).lean();
  for (const element of quarter.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.text = text;
    }
  }
  await Quarter.updateOne(
    { _id: materialId },
    { editableElements: quarter.editableElements }
  );

  res.json(true);
});

const editMonthText = asyncHandler(async (req, res) => {
  const { text, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { text: sanitize(text) });

  //change -- definitely change
  const month = await Month.findOne({ _id: materialId }).lean();
  for (const element of month.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.text = text;
    }
  }
  await Month.updateOne(
    { _id: materialId },
    { editableElements: month.editableElements }
  );

  res.json(true);
});

const editWeekText = asyncHandler(async (req, res) => {
  const { text, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { text: sanitize(text) });

  //change -- definitely change
  const week = await Week.findOne({ _id: materialId }).lean();
  for (const element of week.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.text = text;
    }
  }
  await Week.updateOne(
    { _id: materialId },
    { editableElements: week.editableElements }
  );

  res.json(true);
});

export {
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
  editQuarterDates,
  editQuarterTitle,
  editMonthTitle,
  editMonthDates,
  editWeekTitle,
  editWeekDates,
  editDayTitle,
  insertTextToWeek,
  insertImageToWeekUpload,
  insertImageToWeekEmbed,
  insertVideoToWeek,
  insertLinkToWeek,
  insertDividerToWeek,
  editCaptionOnWeek,
  removeElementFromWeek,
  insertTextToMonth,
  insertImageToMonthUpload,
  insertImageToMonthEmbed,
  insertVideoToMonth,
  insertLinkToMonth,
  insertDividerToMonth,
  editCaptionOnMonth,
  removeElementFromMonth,
  insertTextToQuarter,
  insertImageToQuarterUpload,
  insertImageToQuarterEmbed,
  insertVideoToQuarter,
  insertLinkToQuarter,
  insertDividerToQuarter,
  editCaptionOnQuarter,
  removeElementFromQuarter,
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
  getMonthsWithWeeks,
  getWeeksWithDays,
  getUnitData,
  listTitles,
  editDayDate,
  editWeekDate,
  editDayText,
  editWeekText,
  editMonthText,
  editQuarterText,
};
