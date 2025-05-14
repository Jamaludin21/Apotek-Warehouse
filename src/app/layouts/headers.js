"use client";

import { useHeadTitle } from "@/utils/useDocumentTitle";
import { Layout, Typography } from "antd";

const { Header } = Layout;
const { Title } = Typography;

export function HeaderLayout() {
  const pageTitle = useHeadTitle(null);

  return (
    <Header
      style={{ background: "white" }}
      className="flex items-center justify-between"
    >
      <Title level={4} className="mb-0">
        {pageTitle}
      </Title>
    </Header>
  );
}
