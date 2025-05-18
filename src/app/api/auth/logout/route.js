// import { NextResponse } from "next/server";

// export async function POST() {
//   const res = NextResponse.json({ success: true });
//   res.cookies.set("session", "", {
//     httpOnly: true,
//     maxAge: 0,
//     path: "/",
//   });
//   return res;
// }

import { cookies } from "next/headers";

export async function POST() {
  cookies().delete("session");
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
