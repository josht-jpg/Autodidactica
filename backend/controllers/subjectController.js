import asyncHandler from "express-async-handler";
import Subject from "../models/subjectModel.js";
import Transcript from "../models/transcriptModel.js";
import TranscriptElement from "../models/transcriptElementModel.js";
import User from "../models/userModel.js";
import sanitize from "mongo-sanitize";

const listSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({ user: req.user._id });
  res.json(subjects);
});

const addSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.create({
    user: req.user._id,
    title: sanitize(req.body.subject),
  });

  if (subject) {
    const filter = { _id: req.user._id };
    const update = {
      currentSubject: subject,
      $push: { subjects: subject._id },
    };
    const user = await User.findOneAndUpdate(filter, update);

    const titleElement = await TranscriptElement.create({
      user: req.user._id,
      subjectId: subject._id,
      type: "TITLE",
    });

    const descriptionElement = await TranscriptElement.create({
      user: req.user._id,
      subjectId: subject._id,
      type: "TEXT",
      text: user.name + "'s path to learning " + subject.title,
    });

    const timelineElement = await TranscriptElement.create({
      user: req.user._id,
      subjectId: subject._id,
      type: "TIMELINE",
    });

    const accomplishmentsElement = await TranscriptElement.create({
      user: req.user._id,
      subjectId: subject._id,
      type: "ACCOMPLISHMENTS",
    });

    const projectsElement = await TranscriptElement.create({
      user: req.user._id,
      subjectId: subject._id,
      type: "PROJECTS",
    });

    const resourceElement = await TranscriptElement.create({
      user: req.user._id,
      subjectId: subject._id,
      type: "RESOURCES",
    });

    const exerciseElement = await TranscriptElement.create({
      user: req.user._id,
      subjectId: subject._id,
      type: "EXERCISES",
    });

    const notesElement = await TranscriptElement.create({
      user: req.user._id,
      subjectId: subject._id,
      type: "NOTEPADS",
    });

    await Transcript.create({
      user: req.user._id,
      title: req.body.subject,
      subjectId: subject._id,
      transcriptElements: [
        titleElement,
        descriptionElement,
        timelineElement,
        accomplishmentsElement,
        projectsElement,
        resourceElement,
        exerciseElement,
        notesElement,
      ],
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        subjects: user.subjects,
      },
      subject: {
        _id: subject._id,
        title: subject.title,
        showEditProject: subject.showEditProject,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid Resource Data");
  }
});

const doesSubjectExist = asyncHandler(async (req, res) => {
  const exists = await Subject.findOne({ user: req.user._id });
  res.json(exists);

  /*if(exists) {
        res.json(exists)
    } else {
        res.json(false)
    }*/
});

const updateCurrentSubject = asyncHandler(async (req, res) => {
  await User.updateOne(
    { _id: req.user._id },
    { currentSubject: req.body.subject }
  );
  res.json(true);
});

export { listSubjects, addSubject, doesSubjectExist, updateCurrentSubject };
