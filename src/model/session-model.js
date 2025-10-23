import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
  sessionId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export const Session = mongoose.models.Session ?? mongoose.model("Session", sessionSchema);