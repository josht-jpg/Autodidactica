import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import sanitize from "mongo-sanitize";
import Project from "../models/projectModel.js";
import Transcript from "../models/transcriptModel.js";
import Goal from "../models/goalModel.js";
import Notepad from "../models/notePadModel.js";
import EditableElement from "../models/editableElementModel.js";
import getGoalsData from "../utils/getGoalsData.js";
import uploadImage from "../utils/uploadImage.js";
//import validateHeadersAgainstCSRF from "../utils/validateHeadersAgainstCSRF.js";

const getMyProjects = asyncHandler(async (req, res) => {
  /* if (!validateHeadersAgainstCSRF(req.headers)) {
    return res.sendStatus(401);
  }*/

  const projects = await Project.find({
    user: sanitize(req.user._id),
    subject: sanitize(req.headers.subject),
    isRemoved: false,
  });

  res.json(projects);
});

const addProject = asyncHandler(async (req, res) => {
  const { title, description, imageSrc, _id } = req.body;

  const titleElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "TITLE",
  });

  const thumbnailElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "THUMBNAIL",
  });

  const descriptionElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "DESCRIPTION",
  });

  const goalsElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "GOALS",
  });

  const notesElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "NOTES",
  });

  const project = await Project.create({
    _id,
    subject: req.headers.subject,
    user: req.user._id,
    title: sanitize(title),
    description: sanitize(description),
    //image,
    imageSrc: sanitize(imageSrc),
    editableElements: [
      titleElement,
      thumbnailElement,
      descriptionElement,
      goalsElement,
      notesElement,
    ],
  });

  if (project) {
    const transcript = await Transcript.findOne({
      user: req.user._id,
      subjectId: req.headers.subject,
    });
    await Transcript.updateOne(
      { _id: transcript._id },
      {
        $push: {
          projects: {
            _id: project._id,
            orderIndex: transcript.projects.length,
          },
        },
      }
    );

    res.status(201).json(
      project /*{
      user: project.user,
      title: project.title,
      description: project.description,
      image: project.image,
      imageSrc: project.imageSrc,
      links: project.links,
      resources: project.resources,
    } */
    );
  } else {
    res.status(400);
    throw new Error("Invalid Project Data");
  }
});

const addProjectWithFile = asyncHandler(async (req, res) => {
  const file = req.file;
  let imageKey = mongoose.Types.ObjectId().toString();
  const isUploadSuccess = await uploadImage(file, imageKey);
  const { title, description, id } = req.body;

  const titleElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "TITLE",
  });

  const thumbnailElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "THUMBNAIL",
  });

  const descriptionElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "DESCRIPTION",
  });

  const goalsElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "GOALS",
  });

  const notesElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "NOTES",
  });

  const project = await Project.create({
    _id: id,
    subject: req.headers.subject,
    user: req.user._id,
    title: sanitize(title),
    description: sanitize(description),
    //image,
    imageSrc: `https://primer-beta.s3.us-east-2.amazonaws.com/${imageKey}`,
    editableElements: [
      titleElement,
      thumbnailElement,
      descriptionElement,
      goalsElement,
      notesElement,
    ],
  });

  if (project) {
    const transcript = await Transcript.findOne({
      user: req.user._id,
      subjectId: req.headers.subject,
    });
    await Transcript.updateOne(
      { _id: transcript._id },
      {
        $push: {
          projects: {
            _id: project._id,
            orderIndex: transcript.projects.length,
          },
        },
      }
    );

    res.status(201).json(project);
  } else {
    res.status(400);
    throw new Error("Invalid Project Data");
  }

  res.json(true);
});

const removeProject = asyncHandler(async (req, res) => {
  await Project.updateOne(
    {
      user: req.user._id,
      subject: req.headers.subject,
      _id: req.headers.project,
    },
    { isRemoved: true }
  );

  res.json(true);
});

const getData = asyncHandler(async (req, res) => {
  let data = {};
  data.notes = await Notepad.find({
    user: req.user._id,
    subject: req.headers.subject,
    project: req.headers.project,
    isRemoved: false,
  });
  data.goals = await Goal.find({
    user: req.user._id,
    subject: req.headers.subject,
    projects: req.headers.project,
    isRemoved: false,
  }).lean();

  await getGoalsData(data.goals, req.user._id, req.headers.subject);

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

  const project = await Project.findOne({ _id: materialId });
  const editableElements = [
    ...project.editableElements.slice(0, index),
    newElement,
    ...project.editableElements.slice(index),
  ];

  await Project.updateOne(
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
    url: `https://primer-beta.s3.us-east-2.amazonaws.com/${file.imageKey}`, //ENV VARIABLE?
  });

  const project = await Project.findOne({ _id: req.headers.materialid });
  const editableElements = [
    ...project.editableElements.slice(0, req.headers.index),
    newElement,
    ...project.editableElements.slice(req.headers.index),
  ];

  await Project.updateOne(
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
    url: sanitize(url),
  });

  const project = await Project.findOne({ _id: materialId });
  const editableElements = [
    ...project.editableElements.slice(0, index),
    newElement,
    ...project.editableElements.slice(index),
  ];

  await Project.updateOne(
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
    url: sanitize(url),
  });

  const project = await Project.findOne({ _id: materialId });
  const editableElements = [
    ...project.editableElements.slice(0, index),
    newElement,
    ...project.editableElements.slice(index),
  ];

  await Project.updateOne(
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
    title: sanitize(title),
    url: sanitize(url),
  });

  const project = await Project.findOne({ _id: materialId });
  const editableElements = [
    ...project.editableElements.slice(0, index),
    newElement,
    ...project.editableElements.slice(index),
  ];

  await Project.updateOne(
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

  const project = await Project.findOne({ _id: materialId });
  const editableElements = [
    ...project.editableElements.slice(0, index),
    newElement,
    ...project.editableElements.slice(index),
  ];

  await Project.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const editText = asyncHandler(async (req, res) => {
  const { text, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { text: sanitize(text) });

  //change -- definitely change
  const project = await Project.findOne({ _id: materialId }).lean();
  for (const element of project.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.text = text;
    }
  }
  await Project.updateOne(
    { _id: materialId },
    { editableElements: project.editableElements }
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
  const project = await Project.findOne({ _id: materialId }).lean();
  for (const element of project.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.caption = caption;
    }
  }
  await Project.updateOne(
    { _id: materialId },
    { editableElements: project.editableElements }
  );

  res.json(true);
});

const editTitle = asyncHandler(async (req, res) => {
  const { title, id } = req.body;

  await Project.updateOne({ _id: id }, { title: sanitize(title) });

  res.json(true);
});

const editDescription = asyncHandler(async (req, res) => {
  const { description, id } = req.body;

  await Project.updateOne({ _id: id }, { description: sanitize(description) });

  res.json(true);
});

const removeElement = asyncHandler(async (req, res) => {
  await Project.updateOne(
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

export {
  getMyProjects,
  addProject,
  addProjectWithFile,
  removeProject,
  getData,
  insertText,
  insertImageEmbed,
  insertImageUpload,
  insertVideo,
  insertLink,
  insertDivider,
  editText,
  editCaption,
  editTitle,
  editDescription,
  removeElement,
};
