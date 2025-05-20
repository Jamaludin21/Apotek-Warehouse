"use client";

import { GenericTable } from "@/components/tables/genericTable";
import { columnUsersConfig } from "@/utils/columnHelper";
import { userFields } from "@/utils/fieldHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Form } from "antd";
import { useState } from "react";

export default function UsersContent({ formattedUsers }) {
  useDocumentTitle();
  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [editState, setEditState] = useState(false);
  const [editData, setEditData] = useState(null);

  const showModal = (data) => {
    if (editState && !editData) setEditData(data);
    setOpenModal(true);
  };

  const handleSubmit = (values) => {
    form.resetFields();
    setOpenModal(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setOpenModal(false);
    setEditState(false);
  };

  const propsValue = {
    form,
    openModal,
    fields: userFields,
    modalTitle: editState ? "Edit Data User" : "Add New User",
    editState,
    editData,
  };

  const propsHandle = {
    setEditData,
    setEditState,
    showModal,
    handleSubmit,
    handleCancel,
  };

  return (
    <GenericTable
      title="Available Users List"
      data={formattedUsers}
      config={columnUsersConfig}
      propsHandle={propsHandle}
      propsValue={propsValue}
    />
  );
}
