"use client";

import React from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Dropdown, Typography, Space, Button, Tag } from "antd";
import { LogoutOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { useHeadTitle } from "../../utils/useDocumentTitle";
import { camelText, logout } from "../../utils/functionHelper";
import { useAppContext } from "../../utils/context/appContext";
import { roleColors } from "../../utils/dataHelper";

const { Text } = Typography;

export const HeaderLayout = () => {
  const pageTitle = useHeadTitle(null);
  const { session } = useAppContext();
  const { full_name, email, role } = session;

  const menuItems = [
    {
      key: "email",
      label: <Text>{email}</Text>,
      disabled: true,
    },
    {
      key: "role",
      label: <Tag color={roleColors[role] || "default"}>{camelText(role)}</Tag>,
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
      className="mx-8 mt-3 bgHeader border-radius-2"
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
