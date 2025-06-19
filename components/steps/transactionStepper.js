"use client";

import { Steps, Button, Card, Flex, notification, message } from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { CustomerForm } from "./stepsContent";
import { ProductAssignment } from "./stepsContent";
import { ReviewTransaction } from "./stepsContent";
import { InvoiceSummary } from "./stepsContent";
import {
  BookOutlined,
  LoadingOutlined,
  ProductOutlined,
  TrademarkCircleOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { generateInvoiceImage } from "@/utils/functionHelper";

export default function TransactionStepper({
  propsState,
  propsValue,
  onClose,
}) {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [current, setCurrent] = useState(0);
  const { setFormData } = propsState;
  const { formData, formattedProduct, session } = propsValue;
  const stepKeys = useMemo(
    () => ["customer", "products", "transaction", "invoice"],
    []
  );

  const normalizedProducts = Array.isArray(formData.products)
    ? formData.products
    : Object.values(formData.products);

  const isStepValid = () => {
    const currentKey = stepKeys[current];
    const currentData = formData[currentKey];

    switch (currentKey) {
      case "customer":
        return !!(currentData.name && currentData.phone);
      case "products":
        const productsArray = Array.isArray(currentData)
          ? currentData
          : Object.values(currentData);
        return productsArray.length > 0;
      default:
        return true;
    }
  };

  const next = async () => {
    if (current === 2) {
      setLoading(true);
      setIsTransactionSuccess(false);
      messageApi.open({
        type: "loading",
        content: "Processing transaction...",
      });
      try {
        const res = await fetch("/api/transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            products: normalizedProducts,
            createdById: session?.id,
          }),
        });

        if (!res.ok) throw new Error("Failed to save transaction");

        setIsTransactionSuccess(true);
        notification.success({ message: "Transaction saved" });

        const result = await res.json();
        const invoiceId = result.invoiceId;

        messageApi.open({
          type: "loading",
          content: "Generating Invoice.....",
        });
        // Fetch invoice detail
        const invoiceRes = await fetch(`/api/invoice/${invoiceId}`);
        if (!invoiceRes.ok) throw new Error("Failed to fetch invoice details");
        const invoiceDetail = await invoiceRes.json();

        setInvoiceData(invoiceDetail);
        const generateImageURL = await generateInvoiceImage();
        if (!generateImageURL) throw new Error("Failed generate image URL");

        // ✅ PATCH the image URL to your backend
        const patchRes = await fetch(`/api/invoice/${invoiceDetail.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: generateImageURL }),
        });

        if (!patchRes.ok) throw new Error("Failed to patch generate image URL");

        notification.success({ message: "Invoice generated" });
        setLoading(false);
        messageApi.destroy;
      } catch (err) {
        console.error(err.message);
        notification.error({ message: err.message });
        setLoading(false);
        messageApi.destroy;
        return; // Don't proceed to invoice step
      }
    }

    setCurrent((prev) => prev + 1);
  };

  const prev = () => {
    setCurrent((prev) => prev - 1);
  };

  const handleFormChange = useCallback(
    (_, allValues) => {
      const key = stepKeys[current];
      setFormData((prev) => ({
        ...prev,
        [key]: { ...allValues },
      }));
    },
    [current, stepKeys, setFormData]
  );

  const steps = [
    {
      title: "Customer Detail",
      content: <CustomerForm onChange={handleFormChange} />,
      icon: <UserAddOutlined />,
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
      icon: <ProductOutlined />,
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
      icon: loading ? <LoadingOutlined /> : <TrademarkCircleOutlined />,
    },
    {
      title: "Invoice",
      content: <InvoiceSummary data={invoiceData} />,
      icon: <BookOutlined />,
    },
  ];

  const items = steps.map((step, index) => {
    let status = "wait";

    if (index === current) {
      status = "process";
    } else if (index < current) {
      const key = stepKeys[index];

      if (key === "customer") {
        const customer = formData.customer || {};
        if (customer.name && customer.phone) status = "finish";
      } else if (key === "products") {
        const products = Array.isArray(formData.products)
          ? formData.products
          : Object.values(formData.products || {});
        if (products.length > 0) status = "finish";
      } else if (key === "transaction") {
        // ✅ Only finish if API was successful
        status = isTransactionSuccess ? "finish" : "process";
      }
    }

    // Ensure transaction step (step 2) shows as "process" while loading
    if (stepKeys[index] === "transaction" && index === current) {
      status = loading
        ? "process"
        : isTransactionSuccess
        ? "finish"
        : "process";
    }

    return {
      key: step.title,
      title: step.title,
      icon: step.icon,
      status,
    };
  });

  const CurrentStep = steps[current]?.content;

  return (
    <Card title="Add New Transaction">
      {contextHolder}
      <Steps current={current} items={items} />
      <div className="my-6">{CurrentStep}</div>
      <Flex justify="end" className="mt-6" gap={8}>
        {current < steps.length - 1 && (
          <React.Fragment>
            <Button danger onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            {current > 0 && (
              <Button onClick={prev} disabled={loading}>
                Previous
              </Button>
            )}
            <Button
              type="primary"
              onClick={next}
              disabled={!isStepValid()}
              loading={loading}
            >
              Next
            </Button>
          </React.Fragment>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => (window.location.href = "/transaction")}
          >
            Back to Transactions
          </Button>
        )}
      </Flex>
    </Card>
  );
}
