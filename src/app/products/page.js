"use client";
import { useEffect, useState } from "react";
import { getProducts, addProduct } from "./actions";
import { Table, Button, Modal, Form, Input, InputNumber } from "antd";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("stock", values.stock);
    formData.append("price", values.price);
    await addProduct(formData);
    getProducts().then(setProducts);
    setOpen(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Daftar Produk</h2>
        <Button type="primary" onClick={() => setOpen(true)}>
          Tambah
        </Button>
      </div>
      <Table
        dataSource={products}
        rowKey="id"
        columns={[
          { title: "Nama Produk", dataIndex: "name" },
          { title: "Stok", dataIndex: "stock" },
          { title: "Harga", dataIndex: "price" },
        ]}
      />
      <Modal
        open={open}
        title="Tambah Produk"
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="Nama Produk"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="stock" label="Stok" rules={[{ required: true }]}>
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="price" label="Harga" rules={[{ required: true }]}>
            <InputNumber className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
