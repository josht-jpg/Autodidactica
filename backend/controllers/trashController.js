import asyncHandler from "express-async-handler";
import Goal from "../models/goalModel.js";
import Resource from "../models/resourceModel.js";
import Project from "../models/projectModel.js";
import Exercise from "../models/exerciseModel.js";
import getGoalsData from "../utils/getGoalsData.js";
import Notepad from "../models/notePadModel.js";

const getRemovedItems = asyncHandler(async (req, res) => {
  let removedItems = {
    projects: [],
    resources: [],
    exercises: [],
    goals: [],
    notepads: [],
  };

  removedItems.projects = await Project.find({
    user: req.user._id,
    subject: req.headers.subject,
    isRemoved: true,
  });

  removedItems.resources = await Resource.find({
    user: req.user._id,
    subject: req.headers.subject,
    isRemoved: true,
  });

  removedItems.exercises = await Exercise.find({
    user: req.user._id,
    subject: req.headers.subject,
    isRemoved: true,
  });

  removedItems.goals = await Goal.find({
    user: req.user._id,
    subject: req.headers.subject,
    isRemoved: true,
  });

  await getGoalsData(removedItems.goals, req.user._id, req.headers.subject);

  removedItems.notepads = await Notepad.find({
    user: req.user._id,
    subject: req.headers.subject,
    isRemoved: true,
  }).lean();

  await Promise.all(
    removedItems.notepads.map(async (notepad) => {
      if (notepad.resource) {
        notepad.resource = await Resource.findOne({
          user: req.user._id,
          subject: req.headers.subject,
          _id: notepad.resource,
        });
      } else if (notepad.project) {
        notepad.project = await Project.findOne({
          user: req.user._id,
          subject: req.headers.subject,
          _id: notepad.project,
        });
      } else if (notepad.exercise) {
        notepad.exercise = await Exercise.findOne({
          user: req.user._id,
          subject: req.headers.subject,
          _id: notepad.exercise,
        });
      }
    })
  );

  removedItems.projects.reverse();
  removedItems.resources.reverse();
  removedItems.exercises.reverse();
  removedItems.goals.reverse();
  removedItems.notepads.reverse();

  if (
    removedItems.projects.length === 0 &&
    removedItems.resources.length === 0 &&
    removedItems.exercises.length === 0 &&
    removedItems.goals.length === 0 &&
    removedItems.notepads.length === 0
  ) {
    removedItems.isEmpty = true;
  }
  res.json(removedItems);
});

const restoreItem = asyncHandler(async (req, res) => {
  const { type, id } = req.body;

  if (/*req.headers.item_type*/ type === "project") {
    await Project.updateOne(
      {
        user: req.user._id,
        subject: req.headers.subject,
        _id: id, //req.headers.item_id,
      },
      { isRemoved: false }
    );
  } else if (/*req.headers.item_type*/ type === "resource") {
    await Resource.updateOne(
      {
        user: req.user._id,
        subject: req.headers.subject,
        _id: id, //req.headers.item_id,
      },
      { isRemoved: false }
    );
  } else if (/*req.headers.item_type*/ type === "exercise") {
    await Exercise.updateOne(
      {
        user: req.user._id,
        subject: req.headers.subject,
        _id: id, //req.headers.item_id,
      },
      { isRemoved: false }
    );
  } else if (/*req.headers.item_type*/ type === "goal") {
    await Goal.updateOne(
      {
        user: req.user._id,
        subject: req.headers.subject,
        _id: id, //req.headers.item_id,
      },
      { isRemoved: false }
    );
  } else if (/*req.headers.item_type*/ type === "notepad") {
    await Notepad.updateOne(
      {
        user: req.user._id,
        subject: req.headers.subject,
        _id: id, //req.headers.item_id,
      },
      { isRemoved: false }
    );
  }
  res.json(true);
});

const deleteItem = asyncHandler(async (req, res) => {
  if (req.headers.item_type === "project") {
    await Project.deleteOne({
      user: req.user._id,
      subject: req.headers.subject,
      _id: req.headers.item_id,
    });
  } else if (req.headers.item_type === "resource") {
    await Resource.deleteOne({
      user: req.user._id,
      subject: req.headers.subject,
      _id: req.headers.item_id,
    });
  } else if (req.headers.item_type === "exercise") {
    await Exercise.deleteOne({
      user: req.user._id,
      subject: req.headers.subject,
      _id: req.headers.item_id,
    });
  } else if (req.headers.item_type === "goal") {
    await Goal.deleteOne({
      user: req.user._id,
      subject: req.headers.subject,
      _id: req.headers.item_id,
    });
  } else if (req.headers.item_type === "notepad") {
    await Notepad.deleteOne({
      user: req.user._id,
      subject: req.headers.subject,
      _id: req.headers.item_id,
    });
  }

  res.json(true);
});

export { getRemovedItems, restoreItem, deleteItem };
