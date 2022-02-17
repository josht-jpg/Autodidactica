import Goal from "../models/goalModel.js";
import Resource from "../models/resourceModel.js";
import Project from "../models/projectModel.js";
import Exercise from "../models/exerciseModel.js";

const getSubgoal = async (
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

  return goal;
};

export default getSubgoal;
