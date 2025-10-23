import { User } from "@/model/user-model";
import { Session } from "@/model/session-model";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const profile = await User.findOne({ name });

    if (!profile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userId = profile.userId;
    const sessions = await Session.find({ userId });

    return NextResponse.json({
      profile: {
        userId: profile.userId,
        name: profile.name,
        email: profile.email,
        role: profile.role
      },
      sessions: sessions.map(session => ({
        sessionId: session.sessionId,
        date: session.date,
        start: session.start,
        end: session.end,
        status: session.status
      }))
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}