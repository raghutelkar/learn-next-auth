import { NextResponse } from "next/server";
import { createSession, deleteSession } from "@/queries/sessions";

import { dbConnect } from "@/lib/mongo";

export const POST = async (request) => {
  const {userId, sessionId, date, start, end} = await request.json();

  console.log(userId, sessionId, date, start, end);

  // Create a DB Conenction
  await dbConnect();
  // Form a DB payload
  const newSession = {
    userId,
    sessionId,
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