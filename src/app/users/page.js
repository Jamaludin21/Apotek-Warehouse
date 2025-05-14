"use client";

import ClientLayout from "@/components/client/clientLayout";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Row } from "antd";

export default function UsersPage() {
  useDocumentTitle();
  return (
    <ClientLayout>
      <Row>content</Row>
    </ClientLayout>
  );
}
