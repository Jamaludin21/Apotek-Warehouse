"use client";

import { DynamicSkeleton } from "@/components/skeleton/dynamicSkeleton";
import { GenericTable } from "@/components/tables/genericTable";
import { columnProductConfig } from "@/utils/columnHelper";
import { productFields } from "@/utils/fieldHelper";
import { globalSubmit } from "@/utils/functionHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Card, Form, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductContent({ formattedProduct, categories, user }) {
  useDocumentTitle();
  const [form] = Form.useForm();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [editState, setEditState] = useState(false);
  const [editData, setEditData] = useState(null);
  const [FormValid, setFormValid] = useState(false);
  const [uploadFileList, setUploadFileList] = useState([]);
  const [isImageValid, setIsImageValid] = useState(false);
  const [loadingfetch, setLoadingFetch] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [scrollY, setScrollY] = useState(400);
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    setOpenModal(true);
  };

  const handleSubmit = async () =>
    globalSubmit({ form, propsState, propsValue });

  const handleCancel = () => {
    form.resetFields();
    setOpenModal(false);
    setFormValid(false);
    setIsImageValid(false);
    setEditState(false);
    setEditData(null);
  };

  const propsValue = {
    form,
    openModal,
    FormValid,
    isImageValid,
    fields: productFields(setIsImageValid),
    modalTitle: editState ? "Edit Data Product" : "Add New Product",
    editState,
    editData,
    uploadFileList,
    loadingfetch,
    loadingTable,
    apiUri: "product",
    categoryOptions:
      categories &&
      categories.map((value) => ({
        label: value.name,
        value: value.id,
      })),
    session: user,
    messageApi,
    scrollY,
  };

  const propsState = {
    setOpenModal,
    setEditData,
    setEditState,
    setFormValid,
    setUploadFileList,
    setLoadingFetch,
    setLoadingTable,
    setScrollY,
    router,
  };

  const propsHandle = {
    showModal,
    handleSubmit,
    handleCancel,
  };

  return (
    <Card>
      {contextHolder}
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
