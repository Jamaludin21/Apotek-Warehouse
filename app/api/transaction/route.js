import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { customer, products, createdById } = body;

    if (!createdById) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!customer?.name || !products || Object.keys(products).length === 0) {
      return NextResponse.json(
        { message: "Invalid data submitted" },
        { status: 400 }
      );
    }

    // ✅ Step 1: Validate stock before transaction
    for (const product of products) {
      const current = await prisma.product.findUnique({
        where: { id: product.key },
        select: { stock: true },
      });

      if (!current || current.stock < product.quantity) {
        return NextResponse.json(
          { error: true, message: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }
    }

    // ✅ Step 2: Transaction for saving and stock updating
    const transactionResult = await prisma.$transaction(
      async (tx) => {
        const transaction = await tx.transaction.create({
          data: {
            custName: customer.name,
            phone: customer.phone?.toString() || null,
            createdById,
            items: {
              create: products.map((product) => ({
                product: { connect: { id: product.key } },
                quantity: product.quantity || 1,
                unitPrice: product.price,
                totalPrice: product.quantity * product.price,
              })),
            },
          },
        });

        await Promise.all(
          products.map((product) =>
            tx.product.update({
              where: { id: product.key },
              data: { stock: { decrement: product.quantity } },
            })
          )
        );

        return { transactionId: transaction.id };
      },
      {
        timeout: 15_000,
      }
    );

    // ✅ Step 3: Create invoice after transaction
    const invoice = await prisma.invoice.create({
      data: {
        transactionId: transactionResult.transactionId,
        image: "https://picsum.photos/200", // placeholder
        productInvoices: {
          create: products.map((product) => ({
            productId: product.key,
            quantity: product.quantity || 1,
            unitPrice: product.price,
          })),
        },
      },
    });

    return NextResponse.json(
      {
        transactionId: transactionResult.transactionId,
        invoiceId: invoice.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST TRANSACTION ERROR]", error);
    return NextResponse.json(
      {
        error: true,
        code: "TRANSACTION_FAILED",
        message: error.message || "Unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
