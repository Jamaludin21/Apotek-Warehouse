import { formatCurrency } from "@/utils/functionHelper";
import {
  Form,
  Input,
  Table,
  List,
  InputNumber,
  Card,
  Typography,
  Flex,
} from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";

export const CustomerForm = ({ onChange }) => {
  return (
    <Flex justify="center">
      <Card title="Data Customer" className="add-transaction my-4">
        <Form onValuesChange={onChange} layout="vertical">
          <Form.Item
            name="name"
            label="Customer Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export const ProductAssignment = ({ data, onChange }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const updatedProducts = data
      .filter((item) => selectedRowKeys.includes(item.key))
      .map((item) => ({
        ...item,
        quantity: quantities[item.key] || 1,
      }));

    onChange?.(null, updatedProducts);
  }, [selectedRowKeys, quantities, data, onChange]);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const onSelectionChange = (keys) => {
    setSelectedRowKeys(keys);
  };

  return (
    <Table
      rowSelection={{
        type: "checkbox",
        selectedRowKeys,
        onChange: onSelectionChange,
      }}
      rowKey="key"
      dataSource={data}
      scroll={{ x: 1200, y: 55 * 6 }}
      pagination={false}
      columns={[
        { title: "Product", dataIndex: "name" },
        {
          title: "Price",
          dataIndex: "price",
          render: (value) => formatCurrency(value),
        },
        { title: "Stock", dataIndex: "stock" },
        {
          title: "Quantity",
          render: (_, record) => (
            <InputNumber
              min={1}
              max={record.stock}
              value={quantities[record.key] || 1}
              onChange={(value) => handleQuantityChange(record.key, value)}
              disabled={!selectedRowKeys.includes(record.key)}
            />
          ),
        },
      ]}
    />
  );
};

export const ReviewTransaction = ({ dataCustomer, dataProduct }) => {
  const customer = dataCustomer || {};
  const products = Array.isArray(dataProduct)
    ? dataProduct
    : Object.values(dataProduct || {});

  const items = products.map((product) => ({
    ...product,
    quantity: product.quantity,
    totalPrice: product.price * product.quantity,
  }));

  const total = items.reduce((sum, i) => sum + i.totalPrice, 0);

  return (
    <Flex justify="center">
      <Card
        title={`Customer: ${customer.name}`}
        className="add-transaction my-4"
      >
        <Flex vertical gap={8}>
          <List
            itemLayout="horizontal"
            dataSource={items}
            renderItem={(item, index) => (
              <List.Item>
                {index + 1}. {item.name} - Qty: {item.quantity} - Price:{" "}
                {formatCurrency(item.price)}
              </List.Item>
            )}
          />
          <Typography.Text strong className="flex justify-end mt-4">
            Total Price: {formatCurrency(total)}
          </Typography.Text>
        </Flex>
      </Card>
    </Flex>
  );
};

export const InvoiceSummary = ({ data }) => {
  const transaction = data?.transaction;

  const totalQty =
    transaction?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalPrice =
    transaction?.items.reduce((acc, item) => acc + item.totalPrice, 0) || 0;
  const ppn = totalPrice * 0.1;
  const grandTotal = totalPrice + ppn;

  return (
    <Flex justify="center">
      <Card
        title={<Flex justify="center">Invoice transaction {data?.id}</Flex>}
        className="add-transaction"
      >
        <Flex vertical>
          <Typography.Text>
            <strong>Customer:</strong> {transaction?.custName}
          </Typography.Text>
          <Typography.Text>
            <strong>Phone:</strong> {transaction?.phone || "-"}
          </Typography.Text>
          <Typography.Text>
            <strong>Date:</strong> {new Date(data?.createdAt).toLocaleString()}
          </Typography.Text>
        </Flex>

        <Title level={4} className="mt-4">
          Items:
        </Title>
        <ul>
          {transaction?.items.map((item, index) => (
            <li key={index}>
              {index + 1}. {item.product.name} - {item.quantity} x{" "}
              {formatCurrency(item.unitPrice)} ={" "}
              {formatCurrency(item.totalPrice)}
            </li>
          ))}
        </ul>

        <Flex justify="space-between">
          <Flex vertical>
            <Typography.Text>
              <strong>Total Quantity:</strong> {totalQty}
            </Typography.Text>
            <Typography.Text>
              <strong>Subtotal:</strong> {formatCurrency(totalPrice)}
            </Typography.Text>
          </Flex>

          <Flex vertical>
            <Typography.Text>
              <strong>PPN (10%):</strong> {formatCurrency(ppn)}
            </Typography.Text>
            <Typography.Text>
              <strong>Grand Total:</strong> {formatCurrency(grandTotal)}
            </Typography.Text>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};
