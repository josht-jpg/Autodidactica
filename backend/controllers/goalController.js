import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Goal from "../models/goalModel.js";
import Resource from "../models/resourceModel.js";
import Project from "../models/projectModel.js";
import Exercise from "../models/exerciseModel.js";
import Transcript from "../models/transcriptModel.js";
import Day from "../models/dayModel.js";
import Week from "../models/weekModel.js";
import Month from "../models/monthModel.js";
import Quarter from "../models/quarterModel.js";
import EditableElement from "../models/editableElementModel.js";
import uploadImage from "../utils/uploadImage.js";
import sanitize from "mongo-sanitize";

const getSubgoal = async (goal, req) => {
  goal = await Goal.findOne({ _id: goal, isRemoved: false }).lean();

  if (goal) {
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
  }

  return goal;
};

const getGoals = async (req) => {
  const goals = await Goal.find({
    user: req.user._id,
    subject: req.headers.subject,
    isRemoved: false,
  }).lean();

  await Promise.all(
    goals.map(async (goal) => {
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
    })
  );

  return goals;
};

const getMyGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({
    user: req.user._id,
    subject: req.headers.subject,
    isRemoved: false,
  }).lean();

  await Promise.all(
    goals.map(async (goal) => {
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

      //Not the best way tot this, we're grabbing goals more than once.
      let subgoals = [];
      await Promise.all(
        goal.subgoals.map(async (subgoal) => {
          subgoal = await getSubgoal(subgoal, req);
          subgoals.push(subgoal);
        })
      );
      goal.subgoals = subgoals;
    })
  );

  res.json(goals);
});

const getReadingGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({
    user: req.user._id,
    subject: req.headers.subject,
    type: "book",
    isRemoved: false,
  });

  var books = [];
  await Promise.all(
    goals.map(async (goal) => {
      const book = await Resource.find({
        user: req.user._id,
        subject: req.headers.subject,
        _id: goal.resource._id,
        isRemoved: false,
      });
      if (book) {
        books.push(book);
      }
    })
  );

  res.json({ goals, books });
});

const getGoalsByResource = asyncHandler(async (req, res) => {
  const goals = await Goal.find({
    user: req.user._id,
    subject: req.headers.subject,
    resource: req.resource._id,
    isRemoved: false,
  });
  res.json(goals);
});

const addSubGoalMaterials = (subgoal, projects, resources, exercises) => {
  subgoal.projects.map((project) => {
    if (!projects.includes(project._id)) {
      projects.push(project._id);
    }
  });
  subgoal.resources.map((resource) => {
    if (!resources.includes(resource._id)) {
      resources.push(resource._id);
    }
  });
  subgoal.exercises.map((exercise) => {
    if (!exercises.includes(exercise._id)) {
      exercises.push(exercise._id);
    }
  });

  subgoal.subgoals.map((subSub) => {
    addSubGoalMaterials(subSub, projects, resources, exercises);
  });
};

const addGoal = asyncHandler(async (req, res) => {
  const {
    plan,
    resources,
    exercises,
    projects,
    subgoals,
    day,
    week,
    month,
    quarter,
    _id,
  } = req.body;

  let hasProject = false;
  let hasResource = false;
  let hasExercise = false;

  hasProject = projects.length > 0;
  hasResource = resources.length > 0;
  hasExercise = exercises.length > 0;

  subgoals.map((subgoal) => {
    if (subgoal.hasProject) {
      hasProject = true;
    }
    if (subgoal.hasResource) {
      hasResource = true;
    }
    if (subgoal.hasExercise) {
      hasExercise = true;
    }

    addSubGoalMaterials(subgoal, projects, resources, exercises);
  });

  const iconElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "ICON",
  });

  const titleElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "TITLE",
  });

  const timelineElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "TIMELINE",
  });

  const materialsElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "MATERIALS",
  });

  const completionElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "COMPLETION",
  });

  const subgoalsElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "SUBGOALS",
  });

  const timelineUnit = day
    ? { number: day, type: "day", isMissingData: true }
    : week
    ? { number: week, type: "week", isMissingData: true }
    : month
    ? { number: month, type: "month", isMissingData: true }
    : quarter && { number: quarter, type: "quarter", isMissingData: true };

  let goal;

  if (_id) {
    goal = await Goal.create({
      _id,
      user: req.user._id,
      subject: req.headers.subject,
      resources,
      plan: sanitize(plan),
      exercises,
      projects,
      subgoals: subgoals.map((subgoal) => subgoal._id),
      timelineUnit,
      day,
      week,
      month,
      quarter,
      hasProject,
      hasResource,
      hasExercise,
      editableElements: [
        iconElement,
        titleElement,
        timelineElement,
        materialsElement,
        completionElement,
        subgoalsElement,
      ],
    });
  } else {
    goal = await Goal.create({
      user: req.user._id,
      subject: req.headers.subject,
      resources,
      plan: sanitize(plan),
      exercises,
      projects,
      subgoals: subgoals.map((subgoal) => subgoal._id),
      timelineUnit,
      day,
      week,
      month,
      quarter,
      hasProject,
      hasResource,
      hasExercise,
      editableElements: [
        iconElement,
        titleElement,
        timelineElement,
        materialsElement,
        completionElement,
        subgoalsElement,
      ],
    });
  }

  if (day) {
    await Day.findOneAndUpdate(
      { user: req.user._id, subject: req.headers.subject, number: day },
      { $push: { goals: goal } },
      { useFindAndModify: false }
    );
  }
  if (week) {
    await Week.findOneAndUpdate(
      { user: req.user._id, subject: req.headers.subject, number: week },
      { $push: { goals: goal } },
      { useFindAndModify: false }
    );
  }
  if (month) {
    await Month.findOneAndUpdate(
      { user: req.user._id, subject: req.headers.subject, number: month },
      { $push: { goals: goal } },
      { useFindAndModify: false }
    );
  }
  if (quarter) {
    await Quarter.findOneAndUpdate(
      { user: req.user._id, subject: req.headers.subject, number: quarter },
      { $push: { goals: goal } },
      { useFindAndModify: false }
    );
  }

  if (goal) {
    res.status(201).json(goal);
  } else {
    res.status(400);
    throw new Error("Invalid Goal Data");
  }
});

const addAccomplishment = async (id, status, userId, subjectId) => {
  if (status) {
    const transcript = await Transcript.findOne({
      user: userId,
      subjectId: subjectId,
    });
    await Transcript.updateOne(
      { _id: transcript._id },
      {
        $push: {
          accomplishments: {
            _id: id,
            orderIndex: transcript.accomplishments.length,
          },
        },
      },
      { useFindAndModify: false }
    );
  } else {
    const transcript = await Transcript.findOne({
      user: userId,
      subjectId: subjectId,
    });
    await Transcript.updateOne(
      { _id: transcript._id },
      {
        $pull: {
          accomplishments: {
            _id: id,
          },
        },
      },
      { useFindAndModify: false }
    );
  }
};

const changeStatus = asyncHandler(async (req, res) => {
  const { identifier, status } = req.body;

  if (identifier.plan) {
    const goal = await Goal.findOneAndUpdate(
      {
        user: req.user._id,
        subject: req.headers.subject,
        plan: identifier.plan,
        type: identifier.type,
      },
      {
        isComplete: status,
      },
      { useFindAndModify: false }
    );
    addAccomplishment(goal._id, status, req.user._id, req.headers.subject);
  } else {
    const goal = await Goal.findOneAndUpdate(
      { user: req.user._id, subject: req.headers.subject, _id: identifier },
      {
        isComplete: status,
      },
      { useFindAndModify: false }
    );
    addAccomplishment(goal._id, status, req.user._id, req.headers.subject);
  }

  //Send something back??
  res.send(!req.body.status);
});

const editPlan = asyncHandler(async (req, res) => {
  const { plan, id } = req.body;

  await Goal.updateOne(
    { user: req.user._id, subject: req.headers.subject, _id: id },
    { plan: sanitize(plan) }
  );
  res.status(201).end();
});

const editTextData = asyncHandler(async (req, res) => {
  const { plan, comments, id } = req.body;

  const data = await Goal.findOneAndUpdate(
    { user: req.user._id, subject: req.headers.subject, _id: id },
    { plan: plan, comments: comments },
    { useFindAndModify: false }
  );
  res.json(data);
});

const insertText = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "TEXT",
    text: "",
  });

  const goal = await Goal.findOne({ _id: materialId });
  const editableElements = [
    ...goal.editableElements.slice(0, index),
    newElement,
    ...goal.editableElements.slice(index),
  ];

  await Goal.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertImageUpload = asyncHandler(async (req, res) => {
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

  const goal = await Goal.findOne({ _id: req.headers.materialid });
  const editableElements = [
    ...goal.editableElements.slice(0, req.headers.index),
    newElement,
    ...goal.editableElements.slice(req.headers.index),
  ];

  await Goal.updateOne(
    { _id: req.headers.materialid },
    { editableElements: editableElements }
  );
  //}
  res.json(true);
});

const insertImageEmbed = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "IMAGE",
    url,
  });

  const goal = await Goal.findOne({ _id: materialId });
  const editableElements = [
    ...goal.editableElements.slice(0, index),
    newElement,
    ...goal.editableElements.slice(index),
  ];

  await Goal.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertVideo = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "VIDEO",
    url,
  });

  const goal = await Goal.findOne({ _id: materialId });
  const editableElements = [
    ...goal.editableElements.slice(0, index),
    newElement,
    ...goal.editableElements.slice(index),
  ];

  await Goal.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertLink = asyncHandler(async (req, res) => {
  const { index, title, url, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "LINK",
    title,
    url,
  });

  const goal = await Goal.findOne({ _id: materialId });
  const editableElements = [
    ...goal.editableElements.slice(0, index),
    newElement,
    ...goal.editableElements.slice(index),
  ];

  await Goal.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertDivider = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    _id: elementId,
    type: "DIVIDER",
  });

  const goal = await Goal.findOne({ _id: materialId });
  const editableElements = [
    ...goal.editableElements.slice(0, index),
    newElement,
    ...goal.editableElements.slice(index),
  ];

  await Goal.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const editText = asyncHandler(async (req, res) => {
  const { text, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { text: sanitize(text) });

  //change -- definitely change
  const goal = await Goal.findOne({ _id: materialId }).lean();
  for (const element of goal.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.text = text;
    }
  }
  await Goal.updateOne(
    { _id: materialId },
    { editableElements: goal.editableElements }
  );

  res.json(true);
});

const editCaption = asyncHandler(async (req, res) => {
  const { caption, elementId, materialId } = req.body;

  await EditableElement.updateOne(
    { _id: elementId },
    { caption: sanitize(caption) }
  );

  //change -- definitely change
  const goal = await Goal.findOne({ _id: materialId }).lean();
  for (const element of goal.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.caption = caption;
    }
  }
  await Goal.updateOne(
    { _id: materialId },
    { editableElements: goal.editableElements }
  );

  res.json(true);
});

const removeGoal = asyncHandler(async (req, res) => {
  await Goal.updateOne(
    {
      user: req.user._id,
      subject: req.headers.subject,
      _id: req.headers.goal,
    },
    { isRemoved: true }
  );

  res.json(true);
});

const removeElement = asyncHandler(async (req, res) => {
  await Goal.updateOne(
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

const getAddGoalScreenData = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    user: req.user._id,
    subject: req.headers.subject,
    isRemoved: false,
  });

  const books = await Resource.find({
    user: req.user._id,
    subject: req.headers.subject,
    type: "book",
    isRemoved: false,
  });

  const exercises = await Exercise.find({
    user: req.user._id,
    subject: req.headers.subject,
    isRemoved: false,
  });

  const goals = await getGoals(req);

  let timelineTitles = {
    days: [],
    weeks: [],
    months: [],
    quarters: [],
    years: [],
  };

  timelineTitles.days = await Day.find({
    user: req.user._id,
    subject: req.headers.subject,
  }).select("title number");

  timelineTitles.weeks = await Week.find({
    user: req.user._id,
    subject: req.headers.subject,
  }).select("title number");

  timelineTitles.months = await Month.find({
    user: req.user._id,
    subject: req.headers.subject,
  }).select("title number");

  res.json({ projects, books, exercises, goals, timelineTitles });
});

export {
  getMyGoals,
  getGoalsByResource,
  getReadingGoals,
  addGoal,
  changeStatus,
  editPlan,
  editTextData,
  insertText,
  insertImageUpload,
  insertImageEmbed,
  insertVideo,
  insertLink,
  insertDivider,
  editText,
  editCaption,
  removeGoal,
  removeElement,
  getAddGoalScreenData,
};
