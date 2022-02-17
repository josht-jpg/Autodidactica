import mongoose from "mongoose";

const goalSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Subject",
  },
  isComplete: { type: Boolean, require: false, /* true */ default: false },
  subgoals: { type: Array, require: false, default: [] },
  projects: { type: Array, require: false, default: [] },
  resources: { type: Array, require: false, default: [] },
  exercises: { type: Array, require: false, default: [] },
  plan: { type: String, require: false }, //require?
  type: { type: String, require: true },
  timelineUnit: { type: Object, require: false },
  day: { type: Number, require: false },
  week: { type: Number, require: false },
  month: { type: Number, require: false },
  quarter: { type: Number, require: false },
  comments: { type: String, require: false },
  hasProject: { type: Boolean, require: true, default: false },
  hasResource: { type: Boolean, require: true, default: false },
  hasExercise: { type: Boolean, require: true, default: false },
  editableElements: { type: Array, required: true, default: [] },
  isRemoved: { type: Boolean, require: true, default: false },
});

export default goalSchema;
