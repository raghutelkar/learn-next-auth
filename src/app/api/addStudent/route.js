import { NextResponse } from "next/server";
import { createStudents } from "@/queries/students";

import { dbConnect } from "@/lib/mongo";

export const POST = async (request) => {
  const {mode, studentId, studentName, sessionType} = await request.json();

  // Create a DB Conenction
  await dbConnect();
  // Form a DB payload
  const newStudent = {
    mode,
    studentId,
    studentName,
    sessionType
  }
  // Update the DB
  try {
    await createStudents(newStudent);
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }

  return new NextResponse("New Student has been added", {
    status: 201,
  });

 }
