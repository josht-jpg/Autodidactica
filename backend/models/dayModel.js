import mongoose from "mongoose";

const daySchema = mongoose.Schema(
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
    notepad: { type: mongoose.Schema.Types.ObjectId, require: false },
    comments: { type: String, require: false },
    date: { type: Date, require: false }, //true?
    previousDate: { type: Date, require: false },
    dateGap: { type: Number, require: false },
    nextDate: { type: Date, require: false },
    isFirstOfWeek: { type: Boolean, require: false, default: false },
    title: { type: String, require: false, default: "" },
    editableElements: { type: Array, required: true, default: [] },
    type: { type: String, default: "days" },
  },
  {
    timestamps: true,
  }
);

const Day = mongoose.model("Day", daySchema);

export default Day;
