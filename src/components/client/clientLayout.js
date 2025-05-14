"use client";
import { Spin, theme } from "antd";
import { AppProvider } from "@/utils/context/appContext";
import dynamic from "next/dynamic";

const LazyClientLayoutContent = dynamic(
  () => import("./clientLayoutsContent"),
  {
    loading: () => <Spin fullscreen />,
    ssr: false,
  }
);

export default function ClientLayout({ children }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const propsValue = { colorBgContainer, borderRadiusLG };

  return (
    <AppProvider value={propsValue}>
      <LazyClientLayoutContent>{children}</LazyClientLayoutContent>
    </AppProvider>
  );
}
