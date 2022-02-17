import Goal from "../models/goalModel.js";
import Resource from "../models/resourceModel.js";
import Project from "../models/projectModel.js";
import Exercise from "../models/exerciseModel.js";
import Quarter from "../models/quarterModel.js";
import Month from "../models/monthModel.js";
import Week from "../models/weekModel.js";
import Day from "../models/dayModel.js";

const getSubgoal_refined_with_materials = async (
  goal,
  unitProjects,
  unitBooks,
  unitExercises,
  userId,
  subjectId
) => {
  goal = await Goal.findOne({ _id: goal, isRemoved: false }).lean();

  let resources = [];
  await Promise.all(
    goal.resources.map(async (resource) => {
      resource = await Resource.findOne(
        {
          user: userId,
          subject: subjectId,
          _id: resource,
          isRemoved: false,
        },
        "-user -createdAt -updatedAt"
      );
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
      project = await Project.findOne(
        {
          user: userId,
          subject: subjectId,
          _id: project,
          isRemoved: false,
        },
        "-user -createdAt -updatedAt"
      );
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
      exercise = await Exercise.findOne(
        {
          user: userId,
          subject: subjectId,
          _id: exercise,
          isRemoved: false,
        },
        "-user -createdAt -updatedAt"
      );
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
        userId,
        subjectId
      );
      subgoals.push(subgoal);
    })
  );
  goal.subgoals = subgoals;

  return goal;
};

const queryUnit = async (unitNumber, type, userId, subjectId) => {
  let unit;
  if (type === "quarter") {
    unit = await Quarter.findOne(
      {
        user: userId,
        subject: subjectId,
        number: unitNumber,
      },
      "-user -createdAt -updatedAt"
    ).lean();
  } else if (type === "month") {
    unit = await Month.findOne(
      {
        user: userId,
        subject: subjectId,
        number: unitNumber,
      },
      "-user -createdAt -updatedAt"
    ).lean();
  } else if (type === "week") {
    unit = await Week.findOne(
      {
        user: userId,
        subject: subjectId,
        number: unitNumber,
      },
      "-user -createdAt -updatedAt"
    ).lean();
  } else if (type === "day") {
    unit = await Day.findOne(
      {
        user: userId,
        subject: subjectId,
        number: unitNumber,
      },
      "-user -createdAt -updatedAt"
    ).lean();
  }
  return unit;
};

const getTimelineUnitData = async (units, type, userId, subjectId) => {
  let result = [];
  await Promise.all(
    units.map(async (unit) => {
      if (typeof unit === "number") {
        unit = await queryUnit(unit, type, userId, subjectId);
      }

      let unitGoals = [];
      let unitProjects = [];
      let unitBooks = [];
      let unitExercises = [];
      await Promise.all(
        unit.goals.map(async (goalId) => {
          const goal = await Goal.findOne(
            {
              user: userId,
              subject: subjectId,
              _id: goalId,
              isRemoved: false,
            },
            "-user -createdAt -updatedAt"
          );
          if (goal) {
            unitGoals.push(goal);

            let resources = [];
            await Promise.all(
              goal.resources.map(async (resourceId) => {
                let resource = await Resource.findOne(
                  {
                    user: userId,
                    subject: subjectId,
                    _id: resourceId,
                    isRemoved: false,
                  },
                  "-user -createdAt -updatedAt"
                );
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
                let project = await Project.findOne(
                  {
                    user: userId,
                    subject: subjectId,
                    _id: projectId,
                    isRemoved: false,
                  },
                  "-user -createdAt -updatedAt"
                );
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
                let exercise = await Exercise.findOne(
                  {
                    user: userId,
                    subject: subjectId,
                    _id: exerciseId,
                    isRemoved: false,
                  },
                  "-user -createdAt -updatedAt"
                );
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
                  userId,
                  subjectId
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

      result.push(unit);
    })
  );

  return result; //new
};

export default getTimelineUnitData;
