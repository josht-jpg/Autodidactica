import Goals from "../models/goalModel.js";

const DAY = "DAY";
const WEEK = "WEEK";
const MONTH = "MONTH";
const QUARTER = "QUARTER";

const createGoals = async (goals, userId, subject, timeline, timelineType) => {
  let goalIds = [];

  await Promise.all(
    goals.map(async (goal) => {
      let newGoal;

      goal.resources.map((resource) => {
        if (!resource._id) {
          //resource._id = await Resource.findOne({user: userId, subject, title: resource.title}).select('_id')
        }
      });

      goal.projects.map((project) => {
        if (!project._id) {
          //project._id = await Project.findOne({user: userId, subject, title: project.name}).select('_id')
        }
      });

      //exercise

      if (timelineType === DAY) {
        newGoal = await Goals.create({
          user: userId,
          plan: goal.plan,
          resources: goal.resources,
          project: goal.projects,
          type: goal.type,
          day: timeline,
          subject,
        });
      } else if (timelineType === WEEK) {
        newGoal = await Goals.create({
          user: userId,
          plan: goal.plan,
          resource: goal.resource._id,
          type: goal.type,
          week: timeline,
          subject,
        });
      } else if (timelineType === MONTH) {
        newGoal = await Goals.create({
          user: userId,
          plan: goal.plan,
          resource: goal.resource._id,
          type: goal.type,
          month: timeline,
          subject,
        });
      } else if (timelineType === QUARTER) {
        newGoal = await Goals.create({
          user: userId,
          plan: goal.plan,
          resource: goal.resource._id,
          type: goal.type,
          quarter: timeline,
          subject,
        });
      }

      goalIds.push(newGoal._id);
    })
  );

  return goalIds;
};

export default createGoals;
