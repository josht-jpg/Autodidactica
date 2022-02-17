import mongoose from "mongoose";

const resourceSchema = mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: false,
    },
    imageSrc: {
      type: String,
      required: false,
    },
    authors: {
      type: Array,
      required: false,
    },
    publishedDate: {
      type: String,
      required: false,
    },
    goals: {
      type: Array,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    isHidden: { type: Boolean, require: true, default: false },
    isRemoved: { type: Boolean, require: true, default: false },
    editableElements: { type: Array, required: true, default: [] },
  },
  {
    timestamps: true,
  }
);

export default resourceSchema;
