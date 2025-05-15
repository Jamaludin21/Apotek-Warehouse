"use client";

import ClientLayout from "@/components/client/clientLayout";
import { GenericTable } from "@/components/tables/genericTable";
import { columnProductConfig } from "@/utils/columnHelper";
import { dataProducts } from "@/utils/dataHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";

export default function ProductPage() {
  useDocumentTitle();
  return (
    <ClientLayout>
      <GenericTable
        title="Product Inventory"
        data={dataProducts}
        config={columnProductConfig}
      />
    </ClientLayout>
  );
}
