"use client";

import { GenericTable } from "@/components/tables/genericTable";
import { columnUsersConfig } from "@/utils/columnHelper";
import { dataUsers } from "@/utils/dataHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";

export default function UsersContent() {
  useDocumentTitle();
  return (
    <GenericTable
      title="Available Users List"
      data={dataUsers}
      config={columnUsersConfig}
    />
  );
}
