import { NextResponse } from "next/server";
import { createSession } from "@/queries/sessions";

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