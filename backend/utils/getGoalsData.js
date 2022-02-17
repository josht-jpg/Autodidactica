import Resource from "../models/resourceModel.js";
import Project from "../models/projectModel.js";
import Exercise from "../models/exerciseModel.js";
import Goal from "../models/goalModel.js";

const getSubgoal = async (goal, userId, subjectId) => {
  goal = await Goal.findOne({ _id: goal }).lean();

  if (goal) {
    let resources = [];
    await Promise.all(
      goal.resources.map(async (resource) => {
        resource = await Resource.findOne({
          user: userId,
          subject: subjectId,
          _id: resource,
        });
        resources.push(resource);
      })
    );
    goal.resources = resources;

    let projects = [];
    await Promise.all(
      goal.projects.map(async (projectId) => {
        let project = await Project.findOne({
          user: userId,
          subject: subjectId,
          _id: projectId,
          isRemove: false,
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
          user: userId,
          subject: subjectId,
          _id: exercise,
        });
        exercises.push(exercise);
      })
    );
    goal.exercises = exercises;

    let subgoals = [];
    await Promise.all(
      goal.subgoals.map(async (subgoal) => {
        subgoal = await getSubgoal(subgoal, userId, subjectId);
        subgoals.push(subgoal);
      })
    );
    goal.subgoals = subgoals;
  }

  return goal;
};

const getGoalsData = async (goals, userId, subjectId) => {
  await Promise.all(
    goals.map(async (goal) => {
      /*if(goal.resource){
            goal.resource = await Resource.findOne({user: userid, subject: subjectId, _id: goal.resource})
        } else if (goal.project) {
            goal.project = await Project.findOne({user: userid, subject: subjectId, _id: goal.project})
        } else if (goal.exercise) {
            goal.exercise = await Exercise.findOne({user: userid, subject: subjectId, _id: goal.exercise})
        }*/

      if (goal) {
        let resources = [];
        await Promise.all(
          goal.resources.map(async (resource) => {
            resource = await Resource.findOne({
              user: userId,
              subject: subjectId,
              _id: resource,
            });
            resources.push(resource);
          })
        );
        goal.resources = resources;

        let projects = [];
        await Promise.all(
          goal.projects.map(async (projectId) => {
            let project = await Project.findOne({
              user: userId,
              subject: subjectId,
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
          goal.exercises.map(async (exercise) => {
            exercise = await Exercise.findOne({
              user: userId,
              subject: subjectId,
              _id: exercise,
            });
            exercises.push(exercise);
          })
        );
        goal.exercises = exercises;

        //Not the best way tot this, we're grabbing goals more than once.
        let subgoals = [];
        await Promise.all(
          goal.subgoals.map(async (subgoal) => {
            subgoal = await getSubgoal(subgoal, userId, subjectId);
            subgoals.push(subgoal);
          })
        );
        goal.subgoals = subgoals;
      }
    })
  );

  //return goals
};

export default getGoalsData;
