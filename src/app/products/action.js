"use server";
import prisma from "@/lib/prisma";

export async function getProducts() {
  return await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
}

export async function addProduct(formData) {
  const name = formData.get("name");
  const stock = parseInt(formData.get("stock"));
  const price = parseFloat(formData.get("price"));

  await prisma.product.create({ data: { name, stock, price } });
}
