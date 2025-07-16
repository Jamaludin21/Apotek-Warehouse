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

export default function ClientLayout({ children, session }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const propsValue = { colorBgContainer, borderRadiusLG, session };

  if (!session) {
    window.location.href = "/login";
  }

  return (
    <AppProvider value={propsValue}>
      <LazyClientLayoutContent>{children}</LazyClientLayoutContent>
    </AppProvider>
  );
}
