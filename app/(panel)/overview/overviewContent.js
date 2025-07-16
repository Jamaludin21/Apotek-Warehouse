"use client";

import { SummaryCard } from "@/components/card/overview/mainComponents";
import { GenericTable } from "@/components/tables/genericTable";
import { columnMainConfig } from "@/utils/columnHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Card, Flex, Row } from "antd";
import { useState } from "react";

export default function OverviewContent({ propsCount, formattedTransaction }) {
  useDocumentTitle();
  const [scrollY, setScrollY] = useState(400);

  const propsValue = { scrollY };
  const propsState = { mainPage: true, setScrollY };
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
          propsValue={propsValue}
          propsState={propsState}
        />
      </Card>
    </Flex>
  );
}
