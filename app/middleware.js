import { NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function middleware(req) {
  const token = req.cookies.get("session")?.value;
  const user = token ? verifySession(token) : null;

  const isProtected = req.nextUrl.pathname.startsWith("/");

  if (isProtected && !user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
