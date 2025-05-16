"use client";

import { SummaryCard } from "@/components/card/dashboard/mainComponents";
import ClientLayout from "@/components/client/clientLayout";
import { GenericTable } from "@/components/tables/genericTable";
import { columnMainConfig } from "@/utils/columnHelper";
import { dataMain } from "@/utils/dataHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Flex, Row } from "antd";

export default function DashboardContent() {
  useDocumentTitle();
  return (
    <ClientLayout>
      <Flex vertical gap={24}>
        <Row gutter={[16, 16]}>
          <SummaryCard />
        </Row>
        <GenericTable
          title="Latest Transaction"
          data={dataMain}
          config={columnMainConfig}
        />
      </Flex>
    </ClientLayout>
  );
}
