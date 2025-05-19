"use client";

import { GenericTable } from "@/components/tables/genericTable";
import { columnUsersConfig } from "@/utils/columnHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";

export default function UsersContent({ formattedUsers }) {
  useDocumentTitle();
  return (
    <GenericTable
      title="Available Users List"
      data={formattedUsers}
      config={columnUsersConfig}
    />
  );
}
