"use client";

import { Layout } from "antd";
import { SideLayout } from "@/components/layouts/siders";
import { HeaderLayout } from "@/components/layouts/headers";

const { Content } = Layout;

export default function ClientLayoutContent({ children }) {
  return (
    <Layout className="h-screen">
      <SideLayout />
      <Layout>
        <HeaderLayout />
        <Content className="m-4 p-6 bg-white rounded-xl shadow auto-overflow">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
