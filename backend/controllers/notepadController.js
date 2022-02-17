import asyncHandler from "express-async-handler";
import Notepad from "../models/notePadModel.js";
import Project from "../models/projectModel.js";
import Resource from "../models/resourceModel.js";
import Exercise from "../models/exerciseModel.js";
import Transcript from "../models/transcriptModel.js";
import sanitize from "mongo-sanitize";

const findNoteById = asyncHandler(async (req, res) => {
  const note = await Notepad.findOne({
    user: req.user._id,
    subject: req.headers.subject,
    _id: req.headers.id,
    isRemoved: false,
  });
  res.json(note);
});

const getMyNotes = asyncHandler(async (req, res) => {
  const notes = await Notepad.find({
    user: req.user._id,
    subject: req.headers.subject,
    isRemoved: false,
  }).lean();

  await Promise.all(
    notes.map(async (notepad) => {
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

  res.json(notes);
});

const getNotesByResource = asyncHandler(async (req, res) => {
  const notes = await Notepad.find({
    user: req.user._id,
    subject: req.headers.subject,
    resource: req.headers.resource,
    isRemoved: false,
  });
  res.json(notes);
});

const getNotesByProject = asyncHandler(async (req, res) => {
  const notes = await Notepad.find({
    user: req.user._id,
    subject: req.headers.subject,
    project: req.headers.project,
    isRemoved: false,
  });
  res.json(notes);
});

const getNotesByDay = asyncHandler(async (req, res) => {
  const notes = await Notepad.findOne({
    user: req.user._id,
    subject: req.headers.subject,
    day: req.headers.timeline,
    isRemoved: false,
  });
  res.json(notes);
});

const addNotepad = asyncHandler(async (req, res) => {
  const { name, material, type } = req.body;

  let notepad;
  let returnNotepad = {};
  if (type === "resource") {
    notepad = await Notepad.create({
      user: req.user._id,
      name,
      resource: material[0] ? material[0]._id : material._id,
      subject: req.headers.subject,
    });

    returnNotepad.resource = material[0] ? material[0] : material;
  } else if (type === "project") {
    notepad = await Notepad.create({
      user: req.user._id,
      name,
      project: material[0] ? material[0]._id : material._id,
      subject: req.headers.subject,
    });

    returnNotepad.project = material[0] ? material[0] : material;
  } else if (type === "exercise") {
    notepad = await Notepad.create({
      user: req.user._id,
      name,
      exercise: material[0] ? material[0]._id : material._id,
      subject: req.headers.subject,
    });

    returnNotepad.exercise = material[0] ? material[0] : material;
  } else {
    notepad = await Notepad.create({
      user: req.user._id,
      name,
      subject: req.headers.subject,
    });
  }

  if (notepad) {
    const transcript = await Transcript.findOne({
      user: req.user._id,
      subjectId: req.headers.subject,
    }).select("notepads");

    await Transcript.updateOne(
      {
        user: req.user._id,
        subjectId: req.headers.subject,
      },
      {
        $push: {
          notepads: {
            _id: notepad._id,
            orderIndex: transcript.notepads.length,
          },
        },
      }
    );

    returnNotepad.name = notepad.name;
    returnNotepad._id = notepad._id;

    res.status(201).json(returnNotepad);
  } else {
    res.status(400);
    throw new Error("Invalid Notepad Data");
  }
});

const updateNotepad = asyncHandler(async (req, res) => {
  const { content, notepadId } = req.body;

  Notepad.findOneAndUpdate(
    {
      _id: notepadId,
      subject: req.headers.subject,
      user: req.user._id,
      isRemoved: false,
    },
    { notes: sanitize(content) },
    { useFindAndModify: false },
    function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.send("Succesfully saved.");
    }
  );
});

const editTitle = asyncHandler(async (req, res) => {
  const { title, id } = req.body;

  await Notepad.updateOne({ _id: id }, { name: sanitize(title) });

  res.json(true);
});

const removeNotepad = asyncHandler(async (req, res) => {
  await Notepad.updateOne(
    {
      user: req.user._id,
      subject: req.headers.subject,
      _id: req.headers.notepad,
    },
    { isRemoved: true }
  );

  res.json(true);
});

export {
  getMyNotes,
  findNoteById,
  addNotepad,
  updateNotepad,
  getNotesByResource,
  getNotesByProject,
  getNotesByDay,
  removeNotepad,
  editTitle,
};
