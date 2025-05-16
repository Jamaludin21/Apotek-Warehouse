"use server";

import prisma from "@/lib/prisma";
import { setSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user || user.password !== password) {
    // TODO: Use proper password hashing in production
    return { error: "Invalid username or password" };
  }

  await setSession(user);

  redirect("/dashboard");
}
