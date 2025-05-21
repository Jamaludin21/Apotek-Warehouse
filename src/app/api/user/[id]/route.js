import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const data = await req.json();

  try {
    const updated = await prisma.user.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE({ params }) {
  try {
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
