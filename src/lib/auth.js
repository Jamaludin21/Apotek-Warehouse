import { cookies } from "next/headers";
import prisma from "./prisma";

export async function getSession() {
  const cookieStore = cookies();
  const userSession = cookieStore.get("user_session");
  if (!userSession) return null;

  const user = await prisma.user.findUnique({
    where: { sessionToken: userSession.value },
  });

  return user;
}

export async function setSession(user) {
  const token = crypto.randomUUID(); // Random session token

  await prisma.user.update({
    where: { id: user.id },
    data: { sessionToken: token },
  });

  cookies().set("user_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}
