"use client";

import { SummaryCard } from "@/components/card/dashboard/mainComponents";
import { GenericTable } from "@/components/tables/genericTable";
import { columnMainConfig } from "@/utils/columnHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Flex, Row } from "antd";

export default function DashboardContent({ propsCount, formattedTransaction }) {
  useDocumentTitle();

  const propsState = { mainPage: true };
  return (
    <Flex vertical gap={24}>
      <Row gutter={[16, 16]}>
        <SummaryCard propsCount={propsCount} />
      </Row>
      <GenericTable
        title="Latest Transaction"
        data={formattedTransaction}
        config={columnMainConfig}
        propsState={propsState}
      />
    </Flex>
  );
}
