import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const id = Number(params.id);
  if (isNaN(id))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const category = await prisma.category.findUnique({ where: { id } });
  if (!category)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(category);
}

export async function PATCH(request, { params }) {
  try {
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await request.json();

    const existing = await prisma.category.findFirst({
      where: { name: body.name, NOT: { id } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Category name already used" },
        { status: 400 }
      );
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name: body.name },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(_, { params }) {
  try {
    const id = Number(params.id);
    if (isNaN(id))
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ message: "Category deleted" });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
