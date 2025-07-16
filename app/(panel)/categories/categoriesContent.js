"use client";

import { useState } from "react";
import { Form, Card, message } from "antd";
import { GenericTable } from "@/components/tables/genericTable";
import { columnCategoryConfig } from "@/utils/columnHelper";
import { categoryFields } from "@/utils/fieldHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { globalSubmit } from "@/utils/functionHelper";
import { useRouter } from "next/navigation";
import { DynamicSkeleton } from "@/components/skeleton/dynamicSkeleton";

export default function CategoriesContent({ user, formattedCategories }) {
  useDocumentTitle();
  const [form] = Form.useForm();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [FormValid, setFormValid] = useState(false);
  const [loadingfetch, setLoadingFetch] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [scrollY, setScrollY] = useState(400);
  const [messageApi, contextHolder] = message.useMessage();

  const showModal = () => {
    form.resetFields();
    setOpenModal(true);
  };

  const handleSubmit = async () =>
    globalSubmit({ form, propsState, propsValue });

  const handleCancel = () => {
    form.resetFields();
    setOpenModal(false);
    setFormValid(false);
  };

  const propsValue = {
    form,
    openModal,
    fields: categoryFields,
    modalTitle: "Add New Category",
    loadingfetch,
    loadingTable,
    apiUri: "category",
    session: user,
    messageApi,
    scrollY,
    FormValid,
  };

  const propsState = {
    setOpenModal,
    setLoadingFetch,
    setLoadingTable,
    router,
    setFormValid,
    setScrollY,
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
          title="Category Product"
          data={formattedCategories}
          config={columnCategoryConfig}
          propsHandle={propsHandle}
          propsValue={propsValue}
          propsState={propsState}
        />
      )}
    </Card>
  );
}
