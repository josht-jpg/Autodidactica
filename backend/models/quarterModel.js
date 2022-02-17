import mongoose from "mongoose";

const quarterSchema = mongoose.Schema(
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
    months: { type: Array, require: false, default: [] },
    date: { type: Date, require: false }, //true?
    title: { type: String, require: false, default: "" },
    editableElements: { type: Array, required: true, default: [] },
    type: { type: String, default: "quarters" },
  },
  {
    timestamps: true,
  }
);

const Quarter = mongoose.model("Quarter", quarterSchema);

export default Quarter;
