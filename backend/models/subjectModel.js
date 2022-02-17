import mongoose from "mongoose";

const subjectSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  title: { type: String, require: true },
  isPublic: { type: Boolean, default: false },
});

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
