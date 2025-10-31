import { NextResponse } from "next/server";
import { createSession, deleteSession, updateSession, getAllSessions } from "@/queries/sessions";

import { dbConnect } from "@/lib/mongo";

export const POST = async (request) => {
  const {userId, sessionId, mode, sessionType, students, date, start, end} = await request.json();

  console.log(userId, sessionId, mode, sessionType, students, date, start, end);

  // Create a DB Conenction
  await dbConnect();
  
  // Check for duplicate: same mode, sessionType, students AND overlapping time
  try {
    const allSessions = await getAllSessions();
    const duplicateSession = allSessions.find(session => {
      // First check if mode, sessionType, and students match
      const studentsValue = students || 'N/A';
      if (session.mode !== mode || 
          session.sessionType !== sessionType || 
          session.students !== studentsValue) {
        return false;
      }
      
      // If they match, check for time overlap
      const existingStart = new Date(session.start).getTime();
      const existingEnd = new Date(session.end).getTime();
      const newStart = new Date(start).getTime();
      const newEnd = new Date(end).getTime();
      
      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
    
    if (duplicateSession) {
      return new NextResponse("A session already exists at this time slot", {
        status: 409,
      });
    }
  } catch (err) {
    return new NextResponse(err.message, {
      status: 500,
    });
  }
  
  // Form a DB payload
  const newSession = {
    userId,
    sessionId,
    mode,
    sessionType,
    students: students || 'N/A',
    date,
    start,
    end
  }
  // Update the DB
  try {
    await createSession(newSession);
  } catch (err) {
    return new NextResponse(err.mesage, {
      status: 500,
    });
  }

  return new NextResponse("New Session has been added", {
    status: 201,
  });

 }

export const DELETE = async (request) => {
  try {
    // Get the sessionId from the URL
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return new NextResponse("Session ID is required", {
        status: 400,
      });
    }

    // Connect to database
    await dbConnect();

    // Delete the session
    await deleteSession(sessionId);

    return new NextResponse("Session deleted successfully", {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });

  } catch (error) {
    return new NextResponse(error.message, {
      status: error.message === 'Session not found' ? 404 : 500,
    });
  }
};

export const PUT = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return new NextResponse("Session ID is required", {
                status: 400,
            });
        }

        const updates = await request.json();

        // Connect to database
        await dbConnect();

        // Check for duplicate: same mode, sessionType, students AND overlapping time
        if (updates.start && updates.end) {
            try {
                const allSessions = await getAllSessions();
                const duplicateSession = allSessions.find(session => {
                    // Skip the current session being updated
                    if (session.sessionId === sessionId) return false;
                    
                    // Check if mode, sessionType, and students match
                    const updatedMode = updates.mode || session.mode;
                    const updatedSessionType = updates.sessionType || session.sessionType;
                    const updatedStudents = updates.students || session.students;
                    
                    if (session.mode !== updatedMode || 
                        session.sessionType !== updatedSessionType || 
                        session.students !== updatedStudents) {
                        return false;
                    }
                    
                    // If they match, check for time overlap
                    const existingStart = new Date(session.start).getTime();
                    const existingEnd = new Date(session.end).getTime();
                    const newStart = new Date(updates.start).getTime();
                    const newEnd = new Date(updates.end).getTime();
                    
                    return (
                        (newStart >= existingStart && newStart < existingEnd) ||
                        (newEnd > existingStart && newEnd <= existingEnd) ||
                        (newStart <= existingStart && newEnd >= existingEnd)
                    );
                });
                
                if (duplicateSession) {
                    return new NextResponse("A session already exists at this time slot", {
                        status: 409,
                    });
                }
            } catch (err) {
                return new NextResponse(err.message, {
                    status: 500,
                });
            }
        }

        // Update the session
        await updateSession(sessionId, updates);

        return new NextResponse("Session updated successfully", {
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            }
        });

    } catch (error) {
        return new NextResponse(error.message, {
            status: error.message === 'Session not found' ? 404 : 500,
        });
    }
};