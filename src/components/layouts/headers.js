"use client";

import React from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Dropdown, Typography, Space, Button } from "antd";
import { LogoutOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { useHeadTitle } from "@/utils/useDocumentTitle";
import { logout } from "@/utils/functionHelper";
import { useAppContext } from "@/utils/context/appContext";

const { Text } = Typography;

export const HeaderLayout = () => {
  const pageTitle = useHeadTitle(null);
  const { session } = useAppContext();
  const { full_name, email } = session;

  const menuItems = [
    {
      key: "email",
      label: <Text type="secondary">{email}</Text>,
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      danger: true,
      icon: <LogoutOutlined />,
      label: "Keluar",
      onClick: logout,
    },
  ];

  return (
    <PageHeader
      title={pageTitle}
      className="mx-5 mt-3 bgHeader border-radius-2"
      extra={[
        <Dropdown key="user" menu={{ items: menuItems }}>
          <Button type="text" className="px-0">
            <Space>
              <UserOutlined />
              {full_name}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>,
      ]}
    />
  );
};
