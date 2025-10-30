import { User } from "@/model/user-model";
import { Session } from "@/model/session-model";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongo";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    // If no name is provided, return all users
    if (!name) {
      const allUsers = await User.find({});
      return NextResponse.json({
        users: allUsers.map(user => ({
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role
        }))
      }, { status: 200 });
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
        mode: session.mode,
        sessionType: session.sessionType,
        students: session.students
      }))
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}