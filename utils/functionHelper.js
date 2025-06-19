import { message } from "antd";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
      return (a, b) => {
        const valA = a[dataIndex];
        const valB = b[dataIndex];
        const strA = typeof valA === "string" ? valA : valA?.name || "";
        const strB = typeof valB === "string" ? valB : valB?.name || "";
        return strA.localeCompare(strB);
      };
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

export const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value || 0);

export const formatDateTime = (date) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

export const generateInvoiceImage = async () => {
  const element = document.getElementById("invoice-receipt");
  const canvas = await html2canvas(element);
  // const imgData = canvas.toDataURL("image/png");
  // setImagePreview(imgData); // 👈 show preview

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );

  const formData = new FormData();
  formData.append("file", blob, "invoice.png");

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result = await res.json();
  return result.url; // use this to save to invoice.image
};

export const generatePdf = async () => {
  const element = document.getElementById("invoice-receipt");
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, "PNG", 0, 0);
  pdf.save("invoice.pdf");
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

    setLoadingTable(true);
    router.refresh();
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

    setTimeout(() => {
      setLoadingTable(false);
    }, 500);
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
    router.refresh();
    setLoadingTable(true);
  } catch (err) {
    message.error(err?.message || "Delete failed");
    console.log(err);
  } finally {
    setTimeout(() => setLoadingTable(false), 500);
  }
};
