import Goal from "../models/goalModel.js";
import Resource from "../models/resourceModel.js";
import Project from "../models/projectModel.js";
import Exercise from "../models/exerciseModel.js";
import getSubgoal from "../utils/getSubgoals.js";

const getUnitGoals = async (unit, req) => {
  let unitGoals = [];
  let unitProjects = [];
  let unitBooks = [];
  let unitExercises = [];
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
            subgoal = await getSubgoal(
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

  return { unitGoals, unitProjects, unitBooks, unitExercises };
};

export default getUnitGoals;
