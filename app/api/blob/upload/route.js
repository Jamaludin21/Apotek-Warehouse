import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder") || "misc";

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const dateStr = new Date().toISOString().slice(0, 10);

  const blob = await put(`${folder}/${dateStr}/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json(blob);
}
