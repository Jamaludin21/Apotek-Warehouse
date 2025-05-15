"use client";

import React from "react";
import { PageHeader } from "@ant-design/pro-layout";
import { Dropdown, Typography, Space, Button } from "antd";
import { LogoutOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { useHeadTitle } from "@/utils/useDocumentTitle";

const { Text } = Typography;

const user = {
  name: "Jamaludin Hakim Harsoyo",
  email: "jamaludinhakim21@gmail.com",
};

export const HeaderLayout = () => {
  const pageTitle = useHeadTitle(null);

  const menuItems = [
    {
      key: "email",
      label: <Text type="secondary">{user.email}</Text>,
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
      onClick: () => {
        console.log("Logging out...");
        // TODO: Add your logout logic here
      },
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
              {user.name}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>,
      ]}
    />
  );
};
