import { Student } from "@/model/student-model.js";

export async function getAllStudents() {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 }).lean();
    return students;
  } catch(e) {
    throw new Error(e)
  }
}

export async function createStudents(student) {
  try{
    await Student.create(student);
  } catch(e){
    throw new Error(e)
  }
}

export async function deleteStudent(studentId) {
  try {
    await Student.deleteOne({ studentId });
  } catch(e) {
    throw new Error(e)
  }
}
