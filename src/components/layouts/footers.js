"use client";

import { Layout } from "antd";

const { Footer } = Layout;

export function FooterLayout() {
  return (
    <Footer className="text-center">
      Ant Design ©{new Date().getFullYear()} Created by Ant UED
    </Footer>
  );
}
