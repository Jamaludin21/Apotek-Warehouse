import { withAuth } from "@/lib/withAuth";
import OverviewContent from "./overviewContent";
import prisma from "@/lib/prisma";
import { mappedDataConstructor } from "@/utils/mappedDataHelper";
import { columnMainConfig } from "@/utils/columnHelper";

export default async function OverviewPage() {
  const transaction = await prisma.transaction.findMany({
    include: { createdBy: true, items: true },
  });
  const formattedTransaction = mappedDataConstructor(
    transaction,
    columnMainConfig
  );

  const items = await prisma.transactionItem.findMany();
  const totalRevenue = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalProductSold = items.reduce((sum, item) => sum + item.quantity, 0);
  const productsCount = await prisma.product.count();
  const transactionsCount = await prisma.transaction.count();

  const propsCount = {
    totalRevenue,
    productsCount,
    transactionsCount,
    totalProductSold,
  };

  return withAuth((session) => (
    <OverviewContent
      user={session}
      formattedTransaction={formattedTransaction}
      propsCount={propsCount}
    />
  ));
}
