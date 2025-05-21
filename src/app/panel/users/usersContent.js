"use client";

import { GenericTable } from "@/components/tables/genericTable";
import { columnUsersConfig } from "@/utils/columnHelper";
import { userFields } from "@/utils/fieldHelper";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Form, message } from "antd";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UsersContent({ session, formattedUsers }) {
  useDocumentTitle();
  const [form] = Form.useForm();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [editState, setEditState] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loadingfetch, setLoadingFetch] = useState(false);

  const showModal = () => {
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    const values = await form.getFieldsValue();
    setLoadingFetch(true);
    try {
      if (editState) {
        // Update
        await axios.put(`/api/user/${editData.id}`, values);
        message.success("User updated successfully");
      } else {
        // Create
        await axios.post("/api/user", values);
        message.success("User created successfully");
      }
      router.refresh(); // reload server-side data
    } catch (error) {
      message.error(error?.message || "Failed to submit form");
      console.log(error);
      setLoadingFetch(false);
      return false;
    } finally {
      form.resetFields();
      setOpenModal(false);
      setEditState(false);
      setEditData(null);
      setLoadingFetch(false);
      return true;
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setOpenModal(false);
    setEditState(false);
    setEditData(null);
  };

  const propsValue = {
    form,
    openModal,
    fields: userFields,
    modalTitle: editState ? "Edit Data User" : "Add New User",
    editState,
    editData,
    session,
    loadingfetch,
  };

  const propsHandle = {
    setEditData,
    setEditState,
    setLoadingFetch,
    showModal,
    handleSubmit,
    handleCancel,
    router,
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
