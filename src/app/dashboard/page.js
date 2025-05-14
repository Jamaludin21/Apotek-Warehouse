"use client";

import { SummaryCard } from "@/components/card/dashboard/mainComponents";
import ClientLayout from "@/components/client/clientLayout";
import { MainTable } from "@/components/tables/mainTables";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Flex, Row } from "antd";

export default function DashboardPage() {
  useDocumentTitle();
  return (
    <ClientLayout>
      <Flex vertical gap={24}>
        <Row gutter={[16, 16]}>
          <SummaryCard />
        </Row>
        <MainTable />
      </Flex>
    </ClientLayout>
  );
}
