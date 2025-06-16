import { formatCurrency } from "@/utils/functionHelper";
import {
  Form,
  Input,
  Table,
  Button,
  List,
  InputNumber,
  Card,
  Typography,
  Flex,
  Image,
  Spin,
} from "antd";
import React, { useState } from "react";

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
  const onSelectionChange = (keys) => {
    setSelectedRowKeys(keys);
    const selectedProducts = data.filter((item) => keys.includes(item.key));
    onChange(null, selectedProducts); // triggers `handleFormChange` in parent
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
    quantity: 1,
    totalPrice: product.price,
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

export const InvoiceSummary = ({ data, prev }) => {
  const { transaction } = data;

  console.log(data);

  // const totalQty = transaction.items.length;
  // const totalPrice = transaction.total;
  // const ppn = totalPrice * 0.1;
  // const grandTotal = totalPrice + ppn;

  // return (
  //   <React.Fragment>
  //     <h3>Invoice</h3>
  //     <p>
  //       <b>Customer:</b> {transaction.customer.name}
  //     </p>
  //     <p>
  //       <b>Total Items:</b> {totalQty}
  //     </p>
  //     <p>
  //       <b>Total Price:</b> {totalPrice.toFixed(2)}
  //     </p>
  //     <p>
  //       <b>PPN 10%:</b> {ppn.toFixed(2)}
  //     </p>
  //     <p>
  //       <b>Grand Total:</b> {grandTotal.toFixed(2)}
  //     </p>
  //     <Button onClick={prev}>Previous</Button>
  //   </React.Fragment>
  // );
};
