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

export async function PATCH(req, { params }) {
  const id = parseInt(params.id);
  const body = await req.json();
  const { fileUrl } = body;

  if (!fileUrl) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  try {
    const updated = await prisma.invoice.update({
      where: { id },
      data: { fileUrl },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[PATCH INVOICE ERROR]", error);
    return NextResponse.json(
      { error: true, message: "Failed to update invoice image" },
      { status: 500 }
    );
  }
}
