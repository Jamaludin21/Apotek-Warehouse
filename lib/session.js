import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.AUTH_SECRET || "dev-secret";

export async function createSession(user) {
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      full_name: user.name,
      username: user.username,
      email: user.email,
    },
    SECRET,
    { expiresIn: "7d" }
  );

  return { token };
}

export function verifySession(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

export function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  return verifySession(token);
}
