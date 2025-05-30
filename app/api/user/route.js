import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const data = await req.json();
  const hashedPassword = await bcrypt.hash("password123", 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        ...data,
        role: "KEEPER",
        password: hashedPassword,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
