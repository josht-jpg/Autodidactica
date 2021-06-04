import mongoose from "mongoose";

const createEditableElements = () => {
  const iconElement = {
    _id: mongoose.Types.ObjectId(),
    type: "ICON",
  };

  const titleElement = {
    _id: mongoose.Types.ObjectId(),
    type: "TITLE",
  };

  const timelineElement = {
    _id: mongoose.Types.ObjectId(),
    type: "TIMELINE",
  };

  const materialsElement = {
    _id: mongoose.Types.ObjectId(),
    type: "MATERIALS",
  };

  const completionElement = {
    _id: mongoose.Types.ObjectId(),
    type: "COMPLETION",
  };

  const subgoalsElement = {
    _id: mongoose.Types.ObjectId(),
    type: "SUBGOALS",
  };

  return [
    iconElement,
    titleElement,
    timelineElement,
    materialsElement,
    completionElement,
    subgoalsElement,
  ];
};

export default createEditableElements;
