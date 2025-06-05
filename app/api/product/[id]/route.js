import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const data = await req.json();
  const user = getSession();
  const { id } = params;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updated = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        category: {
          connect: {
            id: Number(data.category),
          },
        },
      },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  const { id } = params;
  const user = getSession();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
