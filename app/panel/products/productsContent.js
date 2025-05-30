"use client";

import { DynamicSkeleton } from "../../../components/skeleton/dynamicSkeleton";
import { GenericTable } from "../../../components/tables/genericTable";
import { columnProductConfig } from "../../../utils/columnHelper";
import { productFields } from "../../../utils/fieldHelper";
import { globalSubmit } from "../../../utils/functionHelper";
import { useDocumentTitle } from "../../../utils/useDocumentTitle";
import { Card, Form } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductContent({ formattedProduct, categories }) {
  useDocumentTitle();
  const [form] = Form.useForm();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [editState, setEditState] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loadingfetch, setLoadingFetch] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);

  const showModal = () => {
    setOpenModal(true);
  };

  const handleSubmit = async () =>
    globalSubmit({ form, propsState, propsValue });

  const handleCancel = () => {
    form.resetFields();
    setOpenModal(false);
    setEditState(false);
    setEditData(null);
  };

  const propsValue = {
    form,
    openModal,
    fields: productFields,
    modalTitle: editState ? "Edit Data Product" : "Add New Product",
    editState,
    editData,
    loadingfetch,
    loadingTable,
    apiUri: "product",
    categoryOptions:
      categories &&
      categories.map((value) => ({
        label: value.name,
        value: value.id,
      })),
  };

  const propsState = {
    setOpenModal,
    setEditData,
    setEditState,
    setLoadingFetch,
    setLoadingTable,
    router,
  };

  const propsHandle = {
    showModal,
    handleSubmit,
    handleCancel,
  };

  return (
    <Card>
      {loadingTable ? (
        <DynamicSkeleton />
      ) : (
        <GenericTable
          title="Product Inventory"
          data={formattedProduct}
          config={columnProductConfig}
          propsHandle={propsHandle}
          propsValue={propsValue}
          propsState={propsState}
        />
      )}
    </Card>
  );
}
