import { Form, Input, Table, Button, List, InputNumber } from "antd";
import React, { useState } from "react";

export const CustomerForm = ({ onChange }) => {
  return (
    <Form onValuesChange={onChange} layout="vertical">
      <Form.Item name="name" label="Customer Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
    </Form>
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
      columns={[
        { title: "Product", dataIndex: "name" },
        { title: "Price", dataIndex: "price" },
        { title: "Stock", dataIndex: "stock" },
      ]}
    />
  );
};

export const ReviewTransaction = ({ dataCustomer, dataProduct }) => {
  console.log("Customer:", dataCustomer);
  console.log("Products:", dataProduct, Array.isArray(dataProduct));

  const customer = dataCustomer.customer || {};
  const products = Array.isArray(dataProduct.products)
    ? dataProduct.products
    : [];

  const items = products.map((product) => ({
    ...product,
    quantity: 1,
    totalPrice: product.price,
  }));

  console.log(items);

  //   const total = items.reduce((sum, i) => sum + i.totalPrice, 0);

  //   return (
  //     <React.Fragment>
  //       <h3>Customer: {customer.name}</h3>
  //       <List
  //         itemLayout="horizontal"
  //         dataSource={items}
  //         renderItem={(item) => (
  //           <List.Item>
  //             {item.name} - Qty: {item.quantity} - Price: {item.price}
  //           </List.Item>
  //         )}
  //       />
  //       <p>
  //         <b>Total:</b> {total}
  //       </p>
  //     </React.Fragment>
  //   );
};

export const InvoiceSummary = ({ data, prev }) => {
  const { transaction } = data;

  const totalQty = transaction.items.length;
  const totalPrice = transaction.total;
  const ppn = totalPrice * 0.1;
  const grandTotal = totalPrice + ppn;

  return (
    <React.Fragment>
      <h3>Invoice</h3>
      <p>
        <b>Customer:</b> {transaction.customer.name}
      </p>
      <p>
        <b>Total Items:</b> {totalQty}
      </p>
      <p>
        <b>Total Price:</b> {totalPrice.toFixed(2)}
      </p>
      <p>
        <b>PPN 10%:</b> {ppn.toFixed(2)}
      </p>
      <p>
        <b>Grand Total:</b> {grandTotal.toFixed(2)}
      </p>
      <Button onClick={prev}>Previous</Button>
    </React.Fragment>
  );
};
