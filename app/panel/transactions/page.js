import { withAuth } from "@/lib/withAuth";
import TransactionContent from "./transactionContent";
import prisma from "@/lib/prisma";
import { mappedDataConstructor } from "@/utils/mappedDataHelper";
import {
  columnProductConfig,
  columnTransactionConfig,
} from "@/utils/columnHelper";

export default async function TransactionsPage() {
  const transaction = await prisma.transaction.findMany({
    include: {
      createdBy: true,
      items: {
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      },
    },
  });

  const mappedTransaction = transaction.map((t) => ({
    ...t,
    total: t.items.reduce((sum, item) => sum + item.totalPrice, 0),
    productNames: t.items.map((i) => i.product?.name).join(", "),
    productImages: t.items.map((i) => i.product?.image).filter(Boolean),
    productCategories: [
      ...new Set(t.items.map((i) => i.product?.category?.name).filter(Boolean)),
    ].join(", "),
  }));

  const formattedTransaction = mappedDataConstructor(
    mappedTransaction,
    columnTransactionConfig
  );

  const products = await prisma.product.findMany({
    orderBy: [{ id: "asc" }, { name: "asc" }],
    include: {
      createdBy: true,
      category: true,
      items: true,
      productInvoices: true,
      productInvoices: {
        include: {
          invoice: true,
        },
      },
    },
  });
  const formattedProduct = mappedDataConstructor(products, columnProductConfig);

  return withAuth((session) => (
    <TransactionContent
      session={session}
      formattedTransaction={formattedTransaction}
      formattedProduct={formattedProduct}
    />
  ));
}
