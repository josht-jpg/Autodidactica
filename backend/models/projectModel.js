import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
  data: { type: Buffer, require: false },
  contentType: { type: String, require: false },
});

const projectSchema = mongoose.Schema({
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
  title: { type: String, require: false }, //require?
  description: { type: String, require: false },
  //image: imageSchema,
  image: { type: String, require: false },
  imageSrc: { type: String, require: false },
  links: { type: Array, require: false },
  resources: { type: Array, require: false },
  isRemoved: { type: Boolean, require: true, default: false },
  //timeline: projectTimelineSchema
  //timeline??????

  editableElements: { type: Array, required: true, default: [] },
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
