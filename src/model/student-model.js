import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema({
  mode: {
    type: String,
    required: true,
    enum: ['online', 'offline']
  },
  studentId: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  sessionType: {
    type: String,
    required: true
  },
}, { timestamps: true });

export const Student = mongoose.models.Student ?? mongoose.model("Student", sessionSchema);