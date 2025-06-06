import "@/styles/global.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Apotek Warehouse & POS",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
        <SpeedInsights />
      </body>
    </html>
  );
}
