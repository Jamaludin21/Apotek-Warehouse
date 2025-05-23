import { withAuth } from "@/lib/withAuth";
import ProductContent from "./productsContent";
import prisma from "@/lib/prisma";
import { mappedDataConstructor } from "@/utils/mappedDataHelper";
import { columnProductConfig } from "@/utils/columnHelper";

export default async function ProductPage() {
  const products = await prisma.product.findMany({
    include: { createdBy: true, category: true },
  });
  const formattedProduct = mappedDataConstructor(products, columnProductConfig);
  if (!products) return;
  return withAuth((session) => (
    <ProductContent user={session} formattedProduct={formattedProduct} />
  ));
}
