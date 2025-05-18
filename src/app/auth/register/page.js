"use client";

import { useState } from "react";
import { Button, Card, Form, Input, Select, Typography } from "antd";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [error, setError] = useState(null);

  const onFinish = async (values) => {
    setError(null);
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      await signIn("credentials", {
        redirect: true,
        username: values.username,
        password: values.password,
        callbackUrl: "/panel/dashboard",
      });
    } else {
      console.error("Registration failed", data);
      setError(data.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bgLogin">
      <div className="form-register">
        <Card>
          <Title level={4}>Register Account</Title>
          <Text>Create a new user for Apotek Warehouse</Text>
          {error && <Text type="danger">{error}</Text>}
          <Form layout="vertical" onFinish={onFinish} className="mt-4">
            <Form.Item name="name" label="Full Name">
              <Input placeholder="Your Full Name" />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Username is required" }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: "email", message: "Invalid email" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Password is required" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item name="role" label="Role" initialValue="KEEPER">
              <Select>
                <Select.Option value="KEEPER">Keeper/Cashier</Select.Option>
                <Select.Option value="MANAGER">Manager</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
