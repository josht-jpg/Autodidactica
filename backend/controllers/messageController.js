import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import Improvement from "../models/improvementModel.js";
import sanitize from "mongo-sanitize";

const storeChat = asyncHandler(async (req, res) => {
  await Chat.create({
    email: req.user.email,
    message: sanitize(req.body.message),
  });
  res.status(204).end();
});

const storeImprovement = asyncHandler(async (req, res) => {
  await Improvement.create({
    email: req.user.email,
    message: sanitize(req.body.message),
  });
  res.status(204).end();
});

export { storeChat, storeImprovement };
