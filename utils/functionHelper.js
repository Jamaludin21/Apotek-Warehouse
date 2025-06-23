import { message, notification } from "antd";
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

  if (!canvas) throw new Error("Failed to generate canvas");

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png")
  );

  const formData = new FormData();
  formData.append("file", blob, `invoice-${Date.now()}.png`);

  const res = await fetch("/api/invoice/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to generate invoice");

  const result = await res.json();
  return result.url;
};

// export const generatePdf = async () => {
//   const element = document.getElementById("invoice-receipt");
//   const canvas = await html2canvas(element);
//   const imgData = canvas.toDataURL("image/png");

//   const pdf = new jsPDF({
//     orientation: "portrait",
//     unit: "px",
//     format: [canvas.width, canvas.height],
//   });

//   pdf.addImage(imgData, "PNG", 0, 0);
//   pdf.save(invoice-${Date.now()}.pdf);
// };

export const generatePdf = async (imageUrl) => {
  console.log(imageUrl);
  try {
    let imgData;
    let imgWidth;
    let imgHeight;

    if (imageUrl) {
      // ✅ 1. Load image from URL
      const img = new Image();
      img.crossOrigin = "anonymous"; // Allow CORS for Blob images
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create a canvas to get image size for scaling
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      imgData = canvas.toDataURL("image/png");
      imgWidth = canvas.width;
      imgHeight = canvas.height;
    } else {
      // ✅ 2. Render DOM to canvas if no imageUrl
      const element = document.getElementById("invoice-receipt");
      if (!element) throw new Error("Invoice element not found");

      const canvas = await html2canvas(element, { scale: 2 });
      imgData = canvas.toDataURL("image/png");
      imgWidth = canvas.width;
      imgHeight = canvas.height;
    }

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;

    const x = (pageWidth - scaledWidth) / 2;
    const y = (pageHeight - scaledHeight) / 2;

    pdf.addImage(imgData, "PNG", x, y, scaledWidth, scaledHeight);
    pdf.save(`invoice-${Date.now()}.pdf`);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
  }
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

  const { editState, apiUri, editData, messageApi } = propsValue;
  const values = await form.getFieldsValue();
  setLoadingFetch(true);
  messageApi.open({
    type: "loading",
    content: "Processing submit...",
  });

  try {
    if (editState) {
      await axios.put(`/api/${apiUri}/${editData.key}`, values);
    } else {
      await axios.post(`/api/${apiUri}`, values);
    }

    notification.success({
      message: editState
        ? `${camelText(apiUri)} updated!`
        : `${camelText(apiUri)} created!`,
    });

    setLoadingTable(true);
    router.refresh();
  } catch (error) {
    notification.error({ message: error || "Failed to submit form" });
    console.log(error);
    setLoadingFetch(false);
    if (editState) setEditState(false);
  } finally {
    form.resetFields();
    setOpenModal(false);
    setLoadingFetch(false);
    if (editState) setEditState(false);
    messageApi.destroy;
    setTimeout(() => {
      setLoadingTable(false);
    }, 500);
  }
};

export const globalDelete = async ({
  record,
  router,
  apiUri,
  messageApi,
  setLoadingTable,
}) => {
  messageApi.open({
    type: "loading",
    content: "Processing delete...",
  });
  try {
    await axios.delete(`/api/${apiUri}/${record.key}`);
    notification.success({ message: `${camelText(apiUri)} deleted!` });
    router.refresh();
    setLoadingTable(true);
  } catch (err) {
    notification.error({ message: err || "Delete failed" });
    console.log(err);
  } finally {
    messageApi.destroy;
    setTimeout(() => setLoadingTable(false), 500);
  }
};
