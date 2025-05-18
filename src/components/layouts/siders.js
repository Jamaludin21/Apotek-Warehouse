"use client";
import { Layout } from "antd";
import {
  AppstoreOutlined,
  ControlOutlined,
  LogoutOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import { logout } from "@/utils/functionHelper";

const { Sider } = Layout;

const LabelSidebar = ({ path, label, pathname }) => {
  const isActive = pathname === path;

  return (
    <Link href={path}>
      <span className={`nav-text ${isActive ? "text-blue-500 font-bold" : ""}`}>
        {label}
      </span>
    </Link>
  );
};

const SidebarItems = () => {
  const pathname = usePathname();
  const selectedKey = pathname.split("/panel/")[1];

  const items = [
    {
      key: "dashboard",
      label: (
        <LabelSidebar
          path="/panel/dashboard"
          label="Dashboard"
          pathname={pathname}
        />
      ),
      icon: <AppstoreOutlined />,
    },
    {
      key: "users",
      label: (
        <LabelSidebar
          path="/panel/users"
          label="Manage User"
          pathname={pathname}
        />
      ),
      icon: <ControlOutlined />,
    },
    {
      key: "products",
      label: (
        <LabelSidebar
          path="/panel/products"
          label="Product"
          pathname={pathname}
        />
      ),
      icon: <ProductOutlined />,
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between">
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={items}
        className="mt-16"
      />
      <Menu
        mode="inline"
        items={[
          {
            key: "logout",
            label: <span onClick={() => logout()}>Keluar</span>,
            danger: true,
            icon: <LogoutOutlined />,
          },
        ]}
      />
    </div>
  );
};

export function SideLayout() {
  return (
    <Sider breakpoint="md" collapsedWidth="0" className="bgSider">
      <SidebarItems />
    </Sider>
  );
}
