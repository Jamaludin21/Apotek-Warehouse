"use client";

import { GenericTable } from "@/components/tables/genericTable";
import { columnProductConfig } from "@/utils/columnHelper";
import { dataProducts } from "@/utils/dataHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";

export default function ProductContent() {
  useDocumentTitle();
  return (
    <GenericTable
      title="Product Inventory"
      data={dataProducts}
      config={columnProductConfig}
    />
  );
}
