import { formatCurrency, generatePdf } from "@/utils/functionHelper";
import {
  Form,
  Input,
  Table,
  List,
  InputNumber,
  Card,
  Typography,
  Flex,
  Modal,
} from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";
import { InvoiceReceipt } from "@/components/InvoiceReceipt";
import { ButtonGeneric } from "@/components/button/buttonGeneric";
import {
  CloseOutlined,
  FilePdfOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

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
            <InputNumber addonBefore="0/+62" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export const ProductAssignment = ({ data, onChange, setScrollY, scrollY }) => {
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

  useEffect(() => {
    const updateScrollY = () => {
      const offset = 350; // Adjust this value based on your header, footer, etc.
      const height = window.innerHeight - offset;
      setScrollY(height > 300 ? height : 300); // minimum height guard
    };

    updateScrollY(); // initial
    window.addEventListener("resize", updateScrollY);

    return () => window.removeEventListener("resize", updateScrollY);
  }, [setScrollY]);

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
      scroll={{ x: 1200, y: scrollY }}
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

export const InvoiceSummary = ({ data, loadingInvoice }) => {
  const transaction = data?.transaction;

  const totalQty =
    transaction?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalPrice =
    transaction?.items.reduce((acc, item) => acc + item.totalPrice, 0) || 0;
  const ppn = totalPrice * 0.1;
  const grandTotal = totalPrice + ppn;

  const modalInvoicePreview = () => {
    Modal.info({
      title: "Invoice Receipt",
      content: <InvoiceReceipt data={data} />,
      closable: true,
      closeIcon: <CloseOutlined />,
      footer: (
        <Flex justify="end" className="mt-4" gap={8}>
          <ButtonGeneric
            key="pdf"
            danger={true}
            icon={<FilePdfOutlined />}
            onclick={() => generatePdf()}
            text="Export as PDF"
          />
        </Flex>
      ),
    });
  };

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
        <Flex className="mt-6" justify="end">
          <ButtonGeneric
            type="primary"
            onclick={modalInvoicePreview}
            icon={<InfoCircleOutlined />}
            text="Preview Invoice"
            disable={loadingInvoice}
            loading={loadingInvoice}
          />
        </Flex>
      </Card>
    </Flex>
  );
};
