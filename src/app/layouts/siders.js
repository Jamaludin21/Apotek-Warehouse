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
  const selectedKey = pathname.split("/")[1];

  const items = [
    {
      key: "dashboard",
      label: (
        <LabelSidebar path="/dashboard" label="Dashboard" pathname={pathname} />
      ),
      icon: <AppstoreOutlined />,
    },
    {
      key: "users",
      label: (
        <LabelSidebar path="/users" label="Manage User" pathname={pathname} />
      ),
      icon: <ControlOutlined />,
    },
    {
      key: "products",
      label: (
        <LabelSidebar path="/products" label="Product" pathname={pathname} />
      ),
      icon: <ProductOutlined />,
    },
  ];

  return (
    <div className="h-full flex flex-col justify-between">
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={items}
        className="mt-16"
      />
      <Menu
        mode="inline"
        theme="dark"
        items={[
          {
            key: "logout",
            label: "Keluar",
            icon: <LogoutOutlined />,
          },
        ]}
      />
    </div>
  );
};

export function SideLayout() {
  return (
    <Sider breakpoint="md" collapsedWidth="0">
      <SidebarItems />
    </Sider>
  );
}
