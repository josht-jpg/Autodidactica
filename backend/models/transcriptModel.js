import mongoose from "mongoose";

const transcriptSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // change this to just subject, yo
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Subject",
    },
    title: { type: String, required: false },
    accomplishmentsHeader: {
      type: String,
      required: false,
      default: "Accomplishments",
    },
    accomplishments: { type: Array, required: true, default: [] },
    hiddenAccomplishments: { type: Array, required: false, default: [] },
    projectsHeader: { type: String, required: false, default: "Projects" },
    projects: { type: Array, required: false, default: [] },
    hiddenProjects: { type: Array, required: false, default: [] },
    resourcesHeader: { type: String, required: false, default: "Resources" },
    resources: { type: Array, required: false, default: [] },
    hiddenResources: { type: Array, required: false, default: [] },
    exercisesHeader: { type: String, required: false, default: "Exercises" },
    exercises: { type: Array, required: false, default: [] },
    hiddenExercises: { type: Array, required: false, default: [] },
    notepadsHeader: { type: String, required: false, default: "Notes" },
    notepads: { type: Array, required: false, default: [] },
    hiddenNotepads: { type: Array, required: false, default: [] },
    timelineHeader: { type: String, required: false, default: "Timeline" },
    years: { type: Array, required: false, default: [] },
    quarters: { type: Array, required: false, default: [] },
    months: { type: Array, required: false, default: [] },
    weeks: { type: Array, required: false, default: [] },
    days: { type: Array, required: false, default: [] },
    transcriptElements: { type: Array, required: true, default: [] },
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Transcript = mongoose.model("transcript", transcriptSchema);

export default Transcript;
