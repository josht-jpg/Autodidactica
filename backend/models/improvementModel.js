import mongoose from "mongoose";

const improvementSchema = mongoose.Schema(
  {
    email: { type: String },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

const Improvement = mongoose.model("Improvement", improvementSchema);

export default Improvement;
