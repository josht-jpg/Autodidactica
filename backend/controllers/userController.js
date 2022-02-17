import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Transcript from "../models/transcriptModel.js";
import Goal from "../models/goalModel.js";
import Resource from "../models/resourceModel.js";
import Project from "../models/projectModel.js";
import Exercise from "../models/exerciseModel.js";
import Notepad from "../models/notePadModel.js";
import Days from "../models/dayModel.js";
import Weeks from "../models/weekModel.js";
import Months from "../models/monthModel.js";
import Quarters from "../models/quarterModel.js";
import Years from "../models/yearModel.js";
import EditableElements from "../models/editableElementModel.js";
import TranscriptElements from "../models/transcriptElementModel.js";
import Subject from "../models/subjectModel.js";
import generateToken from "../utils/generateToken.js";
import sanitize from "mongo-sanitize";

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const cleanEmail = sanitize(email);
  const cleanPassword = sanitize(password);

  const user = await User.findOne({ email: cleanEmail });

  if (user && (await user.matchPassword(cleanPassword))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      subjects: user.subjects,
      currentSubject: user.currentSubject,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json("Invalid email or password. Please try again.");
    throw new Error("Invalid email or password");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const cleanName = sanitize(name);
  const cleanEmail = sanitize(email);
  const cleanPassword = sanitize(password);

  const userExists = await User.findOne({ email: cleanEmail });

  if (userExists) {
    res
      .status(400)
      .json("Oops, this email is already registered. Please try signing in.");
    throw new Error("User already exists");
  }

  const user = await User.create({
    name: cleanName,
    email: cleanEmail,
    password: cleanPassword,
    isMember: true,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      subjects: user.subjects,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid User data");
  }
});

const getUserInfo = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      subjects: user.subjects,
      currentSubject: user.currentSubject,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      subjects: user.subjects,
      currentSubject: user.currentSubject,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      subjects: user.subjects,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.deleteOne({ _id: req.user._id });
  await Resource.deleteMany({ user: req.user._id });
  await Project.deleteMany({ user: req.user._id });
  await Exercise.deleteMany({ user: req.user._id });
  await Goal.deleteMany({ user: req.user._id });
  await EditableElements.deleteMany({ user: req.user._id });
  await Notepad.deleteMany({ user: req.user._id });
  await Subject.deleteMany({ user: req.user._id });
  await Transcript.deleteMany({ user: req.user._id });
  await TranscriptElements.deleteMany({ user: req.user._id });
  await Days.deleteMany({ user: req.user._id });
  await Weeks.deleteMany({ user: req.user._id });
  await Months.deleteMany({ user: req.user._id });
  await Quarters.deleteMany({ user: req.user._id });
  await Years.deleteMany({ user: req.user._id });

  res.status(204).end();
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUserInfo,
  deleteUser,
};
