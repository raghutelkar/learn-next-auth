import { NextResponse } from "next/server";
import { createStudents, getAllStudents, deleteStudent } from "@/queries/students";
import { dbConnect } from "@/lib/mongo";

export const GET = async (request) => {
  try {
    // Create a DB Connection
    await dbConnect();
    
    // Get parameters from query string
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');
    const type = searchParams.get('type');
    
    // Get all students
    const allStudents = await getAllStudents();
    
    // Filter students by mode and/or type if specified
    let students = allStudents;
    
    if (mode && type) {
      // Combine mode and type to match sessionType format in DB (e.g., "onlinepersonal", "offlinepersonal")
      const sessionType = `${mode}${type}`;
      students = students.filter(student => 
        student.mode === mode && student.sessionType === sessionType
      );
    } else if (mode) {
      students = students.filter(student => student.mode === mode);
    } else if (type) {
      // If only type is provided, match any mode with that type
      students = students.filter(student => 
        student.sessionType.includes(type)
      );
    }
    
    return NextResponse.json({
      students: students.map(student => ({
        mode: student.mode,
        studentId: student.studentId,
        studentName: student.studentName,
        sessionType: student.sessionType
      }))
    }, { status: 200 });
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
}

export const POST = async (request) => {
  const {mode, studentId, studentName, sessionType} = await request.json();

  // Create a DB Connection
  await dbConnect();
  
  // Check for duplicate student (same name, mode, and sessionType)
  try {
    const allStudents = await getAllStudents();
    const duplicateStudent = allStudents.find(student => 
      student.studentName.toLowerCase() === studentName.toLowerCase() &&
      student.mode === mode &&
      student.sessionType === sessionType
    );
    
    if (duplicateStudent) {
      return new NextResponse("Student with this name already exists for this mode and session type", {
        status: 409, // Conflict status code
      });
    }
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
  
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

export const DELETE = async (request) => {
  try {
    // Create a DB Connection
    await dbConnect();
    
    // Get studentId from query string
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    
    if (!studentId) {
      return new NextResponse("Student ID is required", {
        status: 400,
      });
    }
    
    // Delete the student
    await deleteStudent(studentId);
    
    return new NextResponse("Student has been deleted", {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
}