import mongoose from "mongoose";

const exerciseSchema = mongoose.Schema({
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
  title: { type: String, require: false },
  description: { type: String, require: false },
  resource: { type: mongoose.Schema.Types.ObjectId, require: false },
  comments: { type: String, require: false },
  link: { type: String, require: false },
  day: { type: Number, require: false },
  week: { type: Number, require: false },
  month: { type: Number, require: false },
  notes: { type: String, require: false },
  editableElements: { type: Array, require: true, default: [] },
  isRemoved: { type: Boolean, require: true, default: false },
});

export default exerciseSchema;
