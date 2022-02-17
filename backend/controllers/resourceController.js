import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Resource from "../models/resourceModel.js";
import Notepad from "../models/notePadModel.js";
import Goal from "../models/goalModel.js";
import Transcript from "../models/transcriptModel.js";
import EditableElement from "../models/editableElementModel.js";
import getGoalsData from "../utils/getGoalsData.js";
import uploadImage from "../utils/uploadImage.js";
import sanitize from "mongo-sanitize";

const getMyResources = asyncHandler(async (req, res) => {
  const resources = await Resource.find({
    user: req.user._id,
    subject: req.headers.subject,
    isRemoved: false,
  });
  res.json(resources);
});

const getMyBooks = asyncHandler(async (req, res) => {
  const books = await Resource.find({
    user: req.user._id,
    subject: req.headers.subject,
    type: "book",
    isRemoved: false,
  });
  res.json(books);
});

const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Resource.find({
    user: req.user._id,
    subject: req.headers.subject,
    type: "course",
  });
  res.json(courses);
});

const createAuthorsString = (authors) => {
  if (authors) {
    if (authors.length <= 1) {
      return authors;
    } else if (authors.length === 2) {
      return authors[0] + " and " + authors[1];
    } else {
      let temp = "";
      for (var i = 0; i < authors.length - 1; i++) {
        temp += authors[i] + ", ";
      }
      temp += "and " + authors[i];
      return temp;
    }
  }
};

const addResource = asyncHandler(async (req, res) => {
  const { title, link, imageSrc, authors, publishedDate, type, _id } = req.body;

  const titleElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "TITLE",
  });

  const coverElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "COVER",
  });

  const authorsElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "AUTHORS",
  });

  const dateElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "PUBLISHEDDATE",
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

  const resource = await Resource.create({
    _id,
    user: req.user._id,
    title: sanitize(title),
    link,
    imageSrc,
    authors: createAuthorsString(authors),
    publishedDate: sanitize(publishedDate),
    type,
    subject: req.headers.subject,
    editableElements: [
      titleElement,
      coverElement,
      authorsElement,
      dateElement,
      goalsElement,
      notesElement,
    ],
  });

  if (resource) {
    const transcript = await Transcript.findOne({
      user: req.user._id,
      subjectId: req.headers.subject,
    });
    await Transcript.updateOne(
      { _id: transcript._id },
      {
        $push: {
          resources: {
            resource: resource._id,
            orderIndex: transcript.resources.length,
          },
        },
      }
    );

    res.status(201).json(resource);
  } else {
    res.status(400);
    throw new Error("Invalid Resource Data");
  }
});

const addBook = asyncHandler(async (req, res) => {
  const { book } = req.body;

  const titleElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "TITLE",
  });

  const coverElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "COVER",
  });

  const authorsElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "AUTHORS",
  });

  const dateElement = await EditableElement.create({
    user: req.user._id,
    subjectId: req.headers.subject,
    type: "PUBLISHEDDATE",
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

  const createdBook = await Resource.create({
    _id: book._id,
    user: req.user._id,
    title: book.title,
    link: book.link,
    imageSrc: book.imageSrc,
    authors:
      typeof book.authors === "string" || book.authors instanceof String
        ? sanitize(book.authors)
        : createAuthorsString(book.authors),
    publishedDate: book.publishedDate,
    type: "book",
    subject: req.headers.subject,
    editableElements: [
      titleElement,
      coverElement,
      authorsElement,
      dateElement,
      goalsElement,
      notesElement,
    ],
  });

  if (createdBook) {
    const transcript = await Transcript.findOne({
      user: req.user._id,
      subjectId: req.headers.subject,
    });
    await Transcript.updateOne(
      { _id: transcript._id },
      {
        $push: {
          resources: {
            resource: createdBook._id,
            orderIndex: transcript.resources.length,
          },
        },
      }
    );

    res.status(201).json(createdBook);
  } else {
    res.status(400);
    throw new Error("Invalid Resource Data");
  }
});

const removeResource = asyncHandler(async (req, res) => {
  await Resource.updateOne(
    {
      user: req.user._id,
      subject: req.headers.subject,
      _id: req.headers.resource,
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
    resource: req.headers.resource,
    isRemoved: false,
  });

  data.goals = await Goal.find({
    user: req.user._id,
    subject: req.headers.subject,
    resources: req.headers.resource,
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

  const resource = await Resource.findOne({ _id: materialId });
  const editableElements = [
    ...resource.editableElements.slice(0, index),
    newElement,
    ...resource.editableElements.slice(index),
  ];

  await Resource.updateOne(
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

  const resource = await Resource.findOne({ _id: req.headers.materialid });
  const editableElements = [
    ...resource.editableElements.slice(0, req.headers.index),
    newElement,
    ...resource.editableElements.slice(req.headers.index),
  ];

  await Resource.updateOne(
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

  const resource = await Resource.findOne({ _id: materialId });
  const editableElements = [
    ...resource.editableElements.slice(0, index),
    newElement,
    ...resource.editableElements.slice(index),
  ];

  await Resource.updateOne(
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

  const resource = await Resource.findOne({ _id: materialId });
  const editableElements = [
    ...resource.editableElements.slice(0, index),
    newElement,
    ...resource.editableElements.slice(index),
  ];

  await Resource.updateOne(
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

  const resource = await Resource.findOne({ _id: materialId });
  const editableElements = [
    ...resource.editableElements.slice(0, index),
    newElement,
    ...resource.editableElements.slice(index),
  ];

  await Resource.updateOne(
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

  const resource = await Resource.findOne({ _id: materialId });
  const editableElements = [
    ...resource.editableElements.slice(0, index),
    newElement,
    ...resource.editableElements.slice(index),
  ];

  await Resource.updateOne(
    { _id: materialId },
    { editableElements: editableElements }
  );

  res.json(newElement);
});

const editTextData = asyncHandler(async (req, res) => {
  const { data, type, id } = req.body;

  const cleanData = sanitize(data);

  let update = {};
  if (type === "title") {
    update = { title: cleanData };
  } else if (type === "publishedDate") {
    update = { publishedDate: cleanData };
  } else if (type === "comments") {
    update = { comments: cleanData };
  }

  const returnData = await Resource.findOneAndUpdate(
    { user: req.user._id, subject: req.headers.subject, _id: id },
    update,
    { useFindAndModify: false }
  );
  res.json(returnData);
});

const editText = asyncHandler(async (req, res) => {
  const { text, elementId, materialId } = req.body;

  await EditableElement.updateOne({ _id: elementId }, { text: sanitize(text) });

  //change -- definitely change
  const resource = await Resource.findOne({ _id: materialId }).lean();
  for (const element of resource.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.text = text;
    }
  }
  await Resource.updateOne(
    { _id: materialId },
    { editableElements: resource.editableElements }
  );

  res.json(true);
});

const editAuthors = asyncHandler(async (req, res) => {
  const { authors, id } = req.body;

  await Resource.updateOne(
    { user: req.user._id, subject: req.headers.subject, _id: id },
    { authors: sanitize(authors) }
  );
  res.status(201).end();
});

const editCaption = asyncHandler(async (req, res) => {
  const { caption, elementId, materialId } = req.body;

  await EditableElement.updateOne(
    { _id: elementId },
    { caption: sanitize(caption) }
  );

  //change -- definitely change
  const resource = await Resource.findOne({ _id: materialId }).lean();
  for (const element of resource.editableElements) {
    if (element._id == elementId) {
      //oofff
      element.caption = caption;
    }
  }
  await Resource.updateOne(
    { _id: materialId },
    { editableElements: resource.editableElements }
  );

  res.json(true);
});

const removeElement = asyncHandler(async (req, res) => {
  await Resource.updateOne(
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
  getMyResources,
  getMyBooks,
  getMyCourses,
  addResource,
  addBook,
  removeResource,
  getData,
  insertText,
  insertImageUpload,
  insertImageEmbed,
  insertVideo,
  insertLink,
  insertDivider,
  editTextData,
  editText,
  editAuthors,
  editCaption,
  removeElement,
};
