import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/queries/users";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/mongo";

export const POST = async (request) => {
  const { userId, name, email, password, role } = await request.json();

  console.log(userId, name, email, password, role);

  try {
    // Create a DB Connection
    await dbConnect();

    // Check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return new NextResponse("Email already registered", {
        status: 409,
      });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 5);

    // Form a DB payload
    const newUser = {
      userId,
      name,
      password: hashedPassword,
      email,
      role,
    };

    // Update the DB
    await createUser(newUser);

    return new NextResponse("User has been created", {
      status: 201,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};