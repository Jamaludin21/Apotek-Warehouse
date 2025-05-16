"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Or return your custom loading spinner
  }

  const handleLogin = async (values) => {
    const res = await signIn("credentials", {
      redirect: false,
      username: values.username,
      password: values.password,
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bgLogin">
      <div className="form-login">
        <Card variant="borderless">
          <Flex
            vertical
            align="center"
            justify="center"
            className="h-full"
            gap={12}
          >
            <Title level={4}>Apotek Warehouse</Title>
            <Text>Login to your account to access this application</Text>
            {error && <Text type="danger">{error}</Text>}
            <Form name="loginForm" onFinish={handleLogin} className="mt-4">
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  className="border-radius-4"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  className="border-radius-4"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  className="mt-4 border-radius-4"
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Flex>
        </Card>
      </div>
    </div>
  );
}
