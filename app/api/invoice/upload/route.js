import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const blob = await put(`invoices/${file.name}`, file, {
    access: "public",
  });

  return NextResponse.json({ url: blob.url, downloadUrl: blob.downloadUrl });
}
