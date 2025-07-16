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
import { InvoiceReceipt } from "@/components/InvoiceReceipt";

export default function TransactionStepper({
  propsState,
  propsValue,
  onClose,
}) {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [current, setCurrent] = useState(0);
  const { setFormData, setScrollY } = propsState;
  const { formData, formattedProduct, session, scrollY } = propsValue;
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
      setLoadingInvoice(false);
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

        setLoading(false);
        setInvoiceData(invoiceDetail);
        setLoadingInvoice(true);

        // ✅ Wait for DOM render before capturing image
        setTimeout(async () => {
          try {
            const generateImageURL = await generateInvoiceImage();
            if (!generateImageURL) throw new Error("Failed generate image URL");

            // ✅ PATCH the image URL to your backend
            const patchRes = await fetch(`/api/invoice/${invoiceDetail.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileUrl: generateImageURL }),
            });

            if (!patchRes.ok)
              throw new Error("Failed to patch invoice image URL");

            notification.success({ message: "Invoice generated" });
          } catch (err) {
            console.error("Image Generation Error:", err);
            notification.error({ message: err });
          } finally {
            setLoadingInvoice(false);
            messageApi.destroy();
          }
        }, 500);
      } catch (err) {
        console.error(err);
        notification.error({ message: err });
        setLoading(false);
        setLoadingInvoice(false);
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
          setScrollY={setScrollY}
          scrollY={scrollY}
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
      content: (
        <InvoiceSummary data={invoiceData} loadingInvoice={loadingInvoice} />
      ),
      icon: loadingInvoice ? <LoadingOutlined /> : <BookOutlined />,
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
    <React.Fragment>
      {invoiceData && (
        <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
          <InvoiceReceipt data={invoiceData} />
        </div>
      )}
      <Card title="Add New Transaction">
        {contextHolder}
        <Steps current={current} items={items} />
        <div className="my-6">{CurrentStep}</div>
        <Flex justify="end" className="mt-6" gap={8}>
          {current < steps.length - 1 && (
            <React.Fragment>
              <Button
                danger
                onClick={onClose}
                disabled={loading || loadingInvoice}
              >
                Cancel
              </Button>
              {current > 0 && (
                <Button onClick={prev} disabled={loading || loadingInvoice}>
                  Previous
                </Button>
              )}
              <Button
                type="primary"
                onClick={next}
                disabled={!isStepValid()}
                loading={loading || loadingInvoice}
              >
                Next
              </Button>
            </React.Fragment>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => (window.location.href = "/transactions")}
            >
              Back to Transactions
            </Button>
          )}
        </Flex>
      </Card>
    </React.Fragment>
  );
}
