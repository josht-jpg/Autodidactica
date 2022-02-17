import mongoose from "mongoose";

const yearSchema = mongoose.Schema(
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
    quarters: { type: Array, require: false, default: [] },
  },
  {
    timestamps: true,
  }
);

const Year = mongoose.model("Year", yearSchema);

export default Year;
