import { hashPassword } from "../../../../lib/hash";
import prisma from "../../../../lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { username, password, name, email, role } = body;

  if (!username || !password) {
    return new Response(JSON.stringify({ message: "Missing fields" }), {
      status: 400,
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    return new Response(
      JSON.stringify({ message: "Username already exists" }),
      {
        status: 409,
      }
    );
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      username,
      password: hashedPassword,
      role: role || "KEEPER", // default role
    },
  });

  return new Response(
    JSON.stringify({ message: "User registered", user: newUser }),
    {
      status: 201,
    }
  );
}
