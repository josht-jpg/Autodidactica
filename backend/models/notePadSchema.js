import mongoose from "mongoose";

const notepadSchema = mongoose.Schema({
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
  name: { type: String, require: false },
  resource: { type: mongoose.Schema.Types.ObjectId, require: false },
  project: { type: mongoose.Schema.Types.ObjectId, require: false },
  exercise: { type: mongoose.Schema.Types.ObjectId, require: false },
  day: { type: Number, require: false },
  week: { type: Number, require: false },
  month: { type: Number, require: false },
  quarter: { type: Number, require: false },
  year: { type: Number, require: false },
  notes: { type: String, require: false },
  isRemoved: { type: Boolean, require: true, default: false },
});

export default notepadSchema;
