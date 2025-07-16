"use client";

import { GenericTable } from "@/components/tables/genericTable";
import { columnUsersConfig } from "@/utils/columnHelper";
import { userFields } from "@/utils/fieldHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Card, Form, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { globalSubmit } from "@/utils/functionHelper";
import { DynamicSkeleton } from "@/components/skeleton/dynamicSkeleton";

export default function UsersContent({ session, formattedUsers }) {
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
    fields: userFields(setIsImageValid),
    modalTitle: editState ? "Edit Data User" : "Add New User",
    editState,
    editData,
    session,
    uploadFileList,
    loadingfetch,
    loadingTable,
    apiUri: "user",
    messageApi,
    scrollY,
  };

  const propsState = {
    setOpenModal,
    setEditData,
    setEditState,
    setFormValid,
    setLoadingFetch,
    setUploadFileList,
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
          title="Available Users List"
          data={formattedUsers}
          config={columnUsersConfig}
          propsHandle={propsHandle}
          propsValue={propsValue}
          propsState={propsState}
        />
      )}
    </Card>
  );
}
