"use client";

import { SummaryCard } from "@/components/card/overview/mainComponents";
import { GenericTable } from "@/components/tables/genericTable";
import { columnMainConfig } from "@/utils/columnHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Card, Flex, Row } from "antd";

export default function OverviewContent({ propsCount, formattedTransaction }) {
  useDocumentTitle();

  const propsState = { mainPage: true };
  return (
    <Flex vertical gap={24}>
      <Row gutter={[16, 16]}>
        <SummaryCard propsCount={propsCount} />
      </Row>
      <Card>
        <GenericTable
          title="Latest Transaction"
          data={formattedTransaction}
          config={columnMainConfig}
          propsState={propsState}
        />
      </Card>
    </Flex>
  );
}
