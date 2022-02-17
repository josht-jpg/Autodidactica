import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    email: { type: String },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
