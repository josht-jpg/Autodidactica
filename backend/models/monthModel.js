import mongoose from "mongoose";

const monthSchema = mongoose.Schema(
  {
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
    number: { type: Number, required: true, default: 0 },
    goals: { type: Array, require: false, default: [] },
    highlights: { type: Array, require: false, default: [] },
    notepad: { type: mongoose.Schema.Types.ObjectId, require: false },
    weeks: { type: Array, require: false, default: [] },
    date: { type: Date, require: false }, //true?
    nextDate: { type: Date, require: false },
    isFirstOfQuarter: { type: Boolean, require: false, default: false },
    title: { type: String, require: false, default: "" },
    editableElements: { type: Array, required: true, default: [] },
    type: { type: String, default: "months" },
  },
  {
    timestamps: true,
  }
);

const Month = mongoose.model("Month", monthSchema);

export default Month;
