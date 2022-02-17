import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Exercise from "../models/exerciseModel.js";
import Resource from "../models/resourceModel.js";
import Notepad from "../models/notePadModel.js";
import Goal from "../models/goalModel.js";
import Transcript from "../models/transcriptModel.js";
import getGoalsData from "../utils/getGoalsData.js";
import EditableElement from "../models/editableElementModel.js";
import uploadImage from "../utils/uploadImage.js";
import sanitize from "mongo-sanitize";

const getMyExercises = asyncHandler(async (req, res) => {
  const exercises = await Exercise.find({
    user: sanitize(req.user._id),
    subject: sanitize(req.headers.subject),
    isRemoved: false,
  }).lean();

  await Promise.all(
    exercises.map(async (exercise) => {
      if (exercise.resource) {
        exercise.resource = await Resource.findOne({
          user: sanitize(req.user._id),
          subject: sanitize(req.headers.subject),
          _id: sanitize(exercise.resource),
        });
      }
    })
  );

  res.json(exercises);
});

const addExercise = asyncHandler(async (req, res) => {
  const { description, title, _id } = req.body;

  ///?????????????

  const iconElement = await EditableElement.create({
    user: sanitize(req.user._id),
    subjectId: sanitize(req.headers.subject),
    type: "ICON",
  });

  const titleElement = await EditableElement.create({
    user: sanitize(req.user._id),
    subjectId: sanitize(req.headers.subject),
    type: "TITLE",
  });

  const descriptionElement = await EditableElement.create({
    user: sanitize(req.user._id),
    subjectId: sanitize(req.headers.subject),
    type: "DESCRIPTION",
  });

  const goalsElement = await EditableElement.create({
    user: sanitize(req.user._id),
    subjectId: sanitize(req.headers.subject),
    type: "GOALS",
  });

  const notesElement = await EditableElement.create({
    user: sanitize(req.user._id),
    subjectId: sanitize(req.headers.subject),
    type: "NOTES",
  });

  const exercise = await Exercise.create({
    _id,
    user: sanitize(req.user._id),
    description: sanitize(description),
    title: sanitize(title),
    subject: sanitize(req.headers.subject),
    editableElements: [
      iconElement,
      titleElement,
      descriptionElement,
      goalsElement,
      notesElement,
    ],
  });

  if (exercise) {
    const transcript = await Transcript.findOne({
      user: sanitize(req.user._id),
      subjectId: sanitize(req.headers.subject),
    });
    await Transcript.updateOne(
      { _id: transcript._id },
      {
        $push: {
          exercises: {
            _id: exercise._id,
            orderIndex: transcript.exercises.length,
          },
        },
      }
    );

    res.status(201).json(exercise);
  } else {
    res.status(400);
    throw new Error("Invalid Exercise Data");
  }
});

const getData = asyncHandler(async (req, res) => {
  let data = {};
  data.notes = await Notepad.find({
    user: sanitize(req.user._id),
    subject: sanitize(req.headers.subject),
    exercise: sanitize(req.headers.exercise),
    isRemoved: false,
  });
  data.goals = await Goal.find({
    user: sanitize(req.user._id),
    subject: sanitize(req.headers.subject),
    exercises: sanitize(req.headers.exercise),
    isRemoved: false,
  }).lean();

  await getGoalsData(
    data.goals,
    sanitize(req.user._id),
    sanitize(req.headers.subject)
  );

  res.json(data);
});

const editTextData = asyncHandler(async (req, res) => {
  const { title, description, id } = req.body;

  const data = await Exercise.findOneAndUpdate(
    {
      user: sanitize(req.user._id),
      subject: sanitize(req.headers.subject),
      _id: id,
    },
    { title: sanitize(title), description: sanitize(description) },
    { useFindAndModify: false }
  );
  res.json(data);
});

const insertText = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: sanitize(req.user._id),
    subjectId: sanitize(req.headers.subject),
    _id: elementId,
    type: "TEXT",
    text: "",
  });

  const exercise = await Exercise.findOne({ _id: materialId });
  const editableElements = [
    ...exercise.editableElements.slice(0, index),
    newElement,
    ...exercise.editableElements.slice(index),
  ];

  await Exercise.updateOne(
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
    user: sanitize(req.user._id),
    subjectId: sanitize(req.headers.subject),
    _id: req.headers.elementid,
    type: "IMAGE",
    url: `https://primer-beta.s3.us-east-2.amazonaws.com/${imageKey}`, //ENV VARIABLE?
  });

  const exercise = await Exercise.findOne({ _id: req.headers.materialid });
  const editableElements = [
    ...exercise.editableElements.slice(0, req.headers.index),
    newElement,
    ...exercise.editableElements.slice(req.headers.index),
  ];

  await Exercise.updateOne(
    { _id: req.headers.materialid },
    { editableElements: editableElements }
  );
  //}
  res.json(true);
});

const insertImageEmbed = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: sanitize(req.user._id),
    subjectId: sanitize(req.headers.subject),
    _id: elementId,
    type: "IMAGE",
    url: sanitize(url),
  });

  const exercise = await Exercise.findOne({ _id: materialId });
  const editableElements = [
    ...exercise.editableElements.slice(0, index),
    newElement,
    ...exercise.editableElements.slice(index),
  ];

  await Exercise.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertVideo = asyncHandler(async (req, res) => {
  const { index, url, materialId, elementId } = req.body;

  const newElement = await EditableElement.create({
    user: sanitize(req.user._id),
    subjectId: sanitize(req.headers.subject),
    _id: sanitize(elementId),
    type: "VIDEO",
    url: sanitize(url),
  });

  const exercise = await Exercise.findOne({ _id: materialId });
  const editableElements = [
    ...exercise.editableElements.slice(0, index),
    newElement,
    ...exercise.editableElements.slice(index),
  ];

  await Exercise.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertLink = asyncHandler(async (req, res) => {
  const { index, title, url, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: sanitize(req.user._id),
    subjectId: sanitize(req.headers.subject),
    _id: elementId,
    type: "LINK",
    title,
    url: sanitize(url),
  });

  const exercise = await Exercise.findOne({ _id: materialId });
  const editableElements = [
    ...exercise.editableElements.slice(0, index),
    newElement,
    ...exercise.editableElements.slice(index),
  ];

  await Exercise.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const insertDivider = asyncHandler(async (req, res) => {
  const { index, materialId, elementId } = req.body;
  const newElement = await EditableElement.create({
    user: sanitize(req.user._id),
    subjectId: sanitize(req.headers.subject),
    _id: sanitize(elementId),
    type: "DIVIDER",
  });

  const exercise = await Exercise.findOne({ _id: materialId });
  const editableElements = [
    ...exercise.editableElements.slice(0, index),
    newElement,
    ...exercise.editableElements.slice(index),
  ];

  await Exercise.updateOne(
    { _id: sanitize(materialId) },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const editText = asyncHandler(async (req, res) => {
  const { text, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { text: text });

  //change -- definitely change
  const exercise = await Exercise.findOne({ _id: materialId }).lean();
  for (const element of exercise.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.text = text;
    }
  }
  await Exercise.updateOne(
    { _id: materialId },
    { editableElements: exercise.editableElements }
  );

  res.json(true);
});

const editCaption = asyncHandler(async (req, res) => {
  const { caption, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { caption: caption });

  //change -- definitely change
  const exercise = await Exercise.findOne({ _id: materialId }).lean();
  for (const element of exercise.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.caption = caption;
    }
  }
  await Exercise.updateOne(
    { _id: materialId },
    { editableElements: exercise.editableElements }
  );

  res.json(true);
});

const removeElement = asyncHandler(async (req, res) => {
  await Exercise.updateOne(
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

const removeExercise = asyncHandler(async (req, res) => {
  await Exercise.updateOne(
    {
      user: sanitize(req.user._id),
      subject: sanitize(req.headers.subject),
      _id: sanitize(req.headers.exercise),
    },
    { isRemoved: true }
  );

  res.json(true);
});

export {
  getMyExercises,
  addExercise,
  getData,
  editTextData,
  insertText,
  insertImageUpload,
  insertImageEmbed,
  insertVideo,
  insertLink,
  insertDivider,
  editText,
  editCaption,
  removeElement,
  removeExercise,
};
