import { User } from "@/model/user-model";
import { Session } from "@/model/session-model";

import { NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongo"

export async function GET(request) {
  await dbConnect();

  const name = 'Varsha'

  try {
    const userData = await User.findOne({ name });
    if(!userData === undefined) return new Response(JSON.stringify([]), {
        status: 404
    })
    const userId = userData?.userId
    const sessions = await Session.find({ userId });


    if (!sessions) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ sessions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}