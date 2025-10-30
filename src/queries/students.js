import { Student } from "@/model/student-model.js";

export async function createStudents(student) {
  try{
    await Student.create(student);
  } catch(e){
    throw new Error(e)
  }
}
