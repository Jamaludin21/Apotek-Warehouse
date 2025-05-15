"use client";

import ClientLayout from "@/components/client/clientLayout";
import { GenericTable } from "@/components/tables/genericTable";
import { columnUsersConfig } from "@/utils/columnHelper";
import { dataUsers } from "@/utils/dataHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";

export default function UsersPage() {
  useDocumentTitle();
  return (
    <ClientLayout>
      <GenericTable
        title="Available Users List"
        data={dataUsers}
        config={columnUsersConfig}
      />
    </ClientLayout>
  );
}
