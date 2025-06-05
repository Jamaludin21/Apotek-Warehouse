import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();
  const user = getSession();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        ...data,
        image: data.image || "https://picsum.photos/200",
        createdBy: {
          connect: { id: user.id },
        },
        category: {
          connect: {
            id: Number(data.category),
          },
        },
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
