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
    type: Date,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  }
}, { timestamps: true });

export const Session = mongoose.models.Session ?? mongoose.model("Session", sessionSchema);