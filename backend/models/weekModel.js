import mongoose from "mongoose";

const weekSchema = mongoose.Schema(
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
    days: { type: Array, require: false, default: [] },
    date: { type: Date, require: false }, //true?
    nextDate: { type: Date, require: false },
    isFirstOfMonth: { type: Boolean, require: false, default: false },
    title: { type: String, require: false, default: "" },
    editableElements: { type: Array, required: true, default: [] },
    type: { type: String, default: "weeks" },
  },
  {
    timestamps: true,
  }
);

const Week = mongoose.model("Week", weekSchema);

export default Week;
