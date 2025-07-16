"use client";
import { Layout } from "antd";
import {
  AppstoreOutlined,
  ControlOutlined,
  GroupOutlined,
  LogoutOutlined,
  ProductOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import { logout } from "@/utils/functionHelper";
import { useAppContext } from "@/utils/context/appContext";

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
  const { session } = useAppContext();
  const pathname = usePathname();
  const selectedKey = pathname.split("/")[1];
  const role = session?.role;

  const items = [
    {
      key: "overview",
      label: (
        <LabelSidebar path="/overview" label="Overview" pathname={pathname} />
      ),
      icon: <AppstoreOutlined />,
      roles: ["MANAGER", "KEEPER"],
    },
    {
      key: "users",
      label: (
        <LabelSidebar path="/users" label="Manage User" pathname={pathname} />
      ),
      icon: <ControlOutlined />,
      roles: ["MANAGER"],
    },
    {
      key: "categories",
      label: (
        <LabelSidebar
          path="/categories"
          label="Manage Category"
          pathname={pathname}
        />
      ),
      icon: <GroupOutlined />,
      roles: ["MANAGER"],
    },
    {
      key: "products",
      label: (
        <LabelSidebar
          path="/products"
          label={role == "MANAGER" ? "Product" : "Stock Product"}
          pathname={pathname}
        />
      ),
      icon: <ProductOutlined />,
      roles: ["MANAGER", "KEEPER"],
    },
    {
      key: "transactions",
      label: (
        <LabelSidebar
          path="/transactions"
          label="Transaction"
          pathname={pathname}
        />
      ),
      icon: <TransactionOutlined />,
      roles: ["KEEPER"],
    },
  ];

  const filteredItems = items.filter(
    (item) => item.roles && item.roles.includes(role)
  );

  return (
    <div className="h-full flex flex-col justify-between">
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        items={filteredItems}
        className="mt-4"
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
