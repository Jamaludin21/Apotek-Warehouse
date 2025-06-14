"use client";

import { Steps, Button, Card, Flex } from "antd";
import { useState } from "react";
import { CustomerForm } from "./stepsContent";
import { ProductAssignment } from "./stepsContent";
import { ReviewTransaction } from "./stepsContent";
import { InvoiceSummary } from "./stepsContent";

export default function TransactionStepper({
  propsState,
  propsValue,
  onClose,
}) {
  const [current, setCurrent] = useState(0);
  const { setFormData } = propsState;
  const { formData, formattedProduct } = propsValue;
  const stepKeys = ["customer", "products", "transaction", "invoice"];

  const next = () => {
    setCurrent((prev) => prev + 1);
  };

  const prev = () => {
    setCurrent((prev) => prev - 1);
  };

  const handleFormChange = (_, allValues) => {
    const key = stepKeys[current];
    setFormData((prev) => ({
      ...prev,
      [key]: { ...allValues }, // always replaces the full step value
    }));
  };

  const steps = [
    {
      title: "Customer Detail",
      content: <CustomerForm onChange={handleFormChange} />,
    },
    {
      title: "Assign Product",
      content: (
        <ProductAssignment
          data={formattedProduct}
          onChange={handleFormChange}
          next={next}
          prev={prev}
        />
      ),
    },
    {
      title: "Review Transaction",
      content: (
        <ReviewTransaction
          dataCustomer={formData.customer}
          dataProduct={formData.products}
          onChange={handleFormChange}
        />
      ),
    },
    {
      title: "Invoice",
      content: <InvoiceSummary data={formData} prev={prev} />,
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const CurrentStep = steps[current]?.content;

  return (
    <Card>
      <Steps current={current} items={items} />
      <div className="my-6">{CurrentStep}</div>
      <Flex justify="end" className="mt-6" gap={8}>
        <Button danger onClick={onClose}>
          Cancel
        </Button>
        {current > 0 && <Button onClick={() => prev()}>Previous</Button>}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
      </Flex>
    </Card>
  );
}
