"use client";

import TransactionStepper from "@/components/steps/transactionStepper";
import { GenericTable } from "@/components/tables/genericTable";
import { columnTransactionConfig } from "@/utils/columnHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Card, Form } from "antd";
import { useState } from "react";

export default function TransactionContent({
  formattedTransaction,
  formattedProduct,
}) {
  useDocumentTitle();
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [stepper, setStepper] = useState(false);
  const [formData, setFormData] = useState({
    customer: {},
    products: [],
  });

  const showModal = () => {
    setOpenModal(true);
  };

  const changesStep = () => {
    setStepper(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpenModal(false);
    setStepper(false);
  };

  const propsValue = {
    form,
    openModal,
    formData,
    formattedProduct,
  };

  const propsState = { transactionStep: true, setFormData };

  const propsHandle = {
    showModal,
    changesStep,
    handleCancel,
  };

  return (
    <Card>
      {stepper ? (
        <TransactionStepper
          propsValue={propsValue}
          propsState={propsState}
          propsHandle={propsHandle}
          onClose={handleCancel}
        />
      ) : (
        <GenericTable
          title="List Transaction"
          data={formattedTransaction}
          config={columnTransactionConfig}
          propsValue={propsValue}
          propsHandle={propsHandle}
          propsState={propsState}
        />
      )}
    </Card>
  );
}
