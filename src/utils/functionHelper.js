import { message } from "antd";
import axios from "axios";

export const generateFilters = (dataIndex, data) => {
  const uniqueValues = Array.from(new Set(data.map((item) => item[dataIndex])));
  return uniqueValues.map((val) => ({
    text: val,
    value: val,
  }));
};

export const getSorter = (type, dataIndex) => {
  switch (type) {
    case "string":
      return (a, b) => a[dataIndex].localeCompare(b[dataIndex]);
    case "number":
      return (a, b) => a[dataIndex] - b[dataIndex];
    case "date":
      return (a, b) => new Date(a[dataIndex]) - new Date(b[dataIndex]);
    default:
      return null;
  }
};

export const camelText = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Function Handling API
export const logout = async () => {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  const data = await res.json();
  if (res.ok) {
    window.location.href = "/auth/login";
  } else {
    console.error(data.error);
  }
};

export const globalSubmit = async ({
  form,
  propsValue = {},
  propsState = {},
}) => {
  const {
    setLoadingFetch,
    setEditState,
    setOpenModal,
    setLoadingTable,
    router,
  } = propsState;

  const { editState, apiUri, editData } = propsValue;
  const values = await form.getFieldsValue();
  setLoadingFetch(true);

  try {
    if (editState) {
      await axios.put(`/api/${apiUri}/${editData.key}`, values);
    } else {
      await axios.post(`/api/${apiUri}`, values);
    }

    message.success(
      editState
        ? `${camelText(apiUri)} updated!`
        : `${camelText(apiUri)} created!`
    );
  } catch (error) {
    message.error(error?.message || "Failed to submit form");
    console.log(error);
    setLoadingFetch(false);
    if (editState) setEditState(false);
  } finally {
    form.resetFields();
    setOpenModal(false);
    setLoadingFetch(false);
    if (editState) setEditState(false);
    setLoadingTable(true);
    router.refresh(); // reload server-side data
    setTimeout(() => setLoadingTable(false), 500);
  }
};

export const globalDelete = async ({
  record,
  router,
  apiUri,
  setLoadingTable,
}) => {
  try {
    await axios.delete(`/api/${apiUri}/${record.key}`);
    message.success(`${camelText(apiUri)} deleted!`);
  } catch (err) {
    message.error(err?.message || "Delete failed");
    console.log(err);
  } finally {
    setLoadingTable(true);
    router.refresh(); // reload server-side data
    setTimeout(() => setLoadingTable(false), 500);
  }
};
