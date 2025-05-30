import { withAuth } from "../../../lib/withAuth";
import DashboardContent from "./dashboardContent";
import prisma from "../../../lib/prisma";
import { mappedDataConstructor } from "../../../utils/mappedDataHelper";
import { columnMainConfig } from "../../../utils/columnHelper";

export default async function DashboardPage() {
  const transaction = await prisma.transaction.findMany({
    include: { createdBy: true },
  });
  const formattedTransaction = mappedDataConstructor(
    transaction,
    columnMainConfig
  );

  const usersCount = await prisma.user.count();
  const productsCount = await prisma.product.count();
  const categoriesCount = await prisma.category.count();
  const transactionsCount = await prisma.transaction.count();

  const propsCount = {
    usersCount,
    productsCount,
    categoriesCount,
    transactionsCount,
  };

  return withAuth((session) => (
    <DashboardContent
      user={session}
      formattedTransaction={formattedTransaction}
      propsCount={propsCount}
    />
  ));
}
