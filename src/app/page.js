"use client";

import { useAppContext } from "@/utils/context/appContext";

export default function Home() {
  const { colorBgContainer, borderRadiusLG } = useAppContext();
  return (
    <div
      style={{
        padding: 24,
        minHeight: 360,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      content
    </div>
  );
}
