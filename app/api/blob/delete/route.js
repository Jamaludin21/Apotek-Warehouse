import { del } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { url } = await req.json();

  try {
    const { pathname } = new URL(url);
    const blobPath = decodeURIComponent(pathname.slice(1));

    await del(blobPath);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete blob error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
