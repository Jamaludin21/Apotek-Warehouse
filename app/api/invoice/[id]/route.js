import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_, { params }) {
  const invoiceId = parseInt(params.id);

  if (isNaN(invoiceId)) {
    return NextResponse.json({ error: "Invalid invoice ID" }, { status: 400 });
  }

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        transaction: {
          include: {
            items: { include: { product: true } },
          },
        },
        productInvoices: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("[GET INVOICE ERROR]", error);
    return NextResponse.json(
      {
        error: true,
        message: "Failed to fetch invoice detail",
      },
      { status: 500 }
    );
  }
}
