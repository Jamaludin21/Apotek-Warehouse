import { items } from "@/utils/dataHelper";
import { Menu, Layout } from "antd";

const { Sider } = Layout;

export function SideLayout() {
  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={items}
      />
    </Sider>
  );
}
