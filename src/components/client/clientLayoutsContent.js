"use client";

import { Layout } from "antd";
import { SideLayout } from "@/app/layouts/siders";
import { HeaderLayout } from "@/app/layouts/headers";
import { FooterLayout } from "@/app/layouts/footers";

const { Content } = Layout;

export default function ClientLayoutContent({ children }) {
  return (
    <Layout className="min-h-[100dvh]">
      <SideLayout />
      <Layout>
        <HeaderLayout />
        <Content className="m-4 p-6 bg-white rounded-xl shadow">
          {children}
        </Content>
        <FooterLayout />
      </Layout>
    </Layout>
  );
}
