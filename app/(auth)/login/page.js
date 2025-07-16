"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  message,
  notification,
  Typography,
} from "antd";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [error, setError] = useState(null);
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = async (values) => {
    messageApi.open({
      type: "loading",
      content: "Verify credential...",
    });
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        messageApi.destroy;
        notification.success({
          message: "Login Success",
          description: "Please wait to redirect into dashboard",
        });
        router.push("/overview");
      } else {
        messageApi.destroy;
        notification.error({ message: data.error });
        setError(data.error);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bgLogin">
      {contextHolder}
      <Card className="form-login">
        <Flex vertical align="center" gap={12}>
          <Title level={4}>Apotek Warehouse</Title>
          <Text>Login to your account</Text>
          {error && <Text type="danger">{error}</Text>}
          <Form name="loginForm" onFinish={handleLogin}>
            <Form.Item name="username" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true }]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit" loading={loading}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Card>
    </div>
  );
}
