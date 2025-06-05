import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/hash";
import { createSession } from "@/lib/session";

export async function POST(req) {
  const { username, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await comparePassword(password, user.password))) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const session = await createSession(user);

  cookies().set({
    name: "session",
    value: session.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return NextResponse.json({ success: true });
}
