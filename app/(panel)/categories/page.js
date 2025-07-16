import { withAuth } from "@/lib/withAuth";
import CategoriesContent from "./categoriesContent";
import prisma from "@/lib/prisma";
import { columnCategoryConfig } from "@/utils/columnHelper";
import { mappedDataConstructor } from "@/utils/mappedDataHelper";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ id: "asc" }, { name: "asc" }],
  });

  const formattedCategories = mappedDataConstructor(
    categories,
    columnCategoryConfig
  );

  if (!categories) return;

  return withAuth((session) => (
    <CategoriesContent
      user={session}
      formattedCategories={formattedCategories}
    />
  ));
}
