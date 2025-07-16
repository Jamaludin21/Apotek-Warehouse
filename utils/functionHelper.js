import { Modal, notification, Upload } from "antd";
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
  if (!element) throw new Error("Invoice element not found");

  const canvas = await html2canvas(element);
  if (!canvas) throw new Error("Failed to generate canvas");

  const blob = await new Promise((resolve) => {
    canvas.toBlob(resolve, "image/png");
  });

  if (!blob) throw new Error("Failed to create image blob");

  const file = new File([blob], `invoice-${Date.now()}.png`, {
    type: "image/png",
  });

  // ✅ Reuse utility
  const imageUrl = await uploadToVercelBlob(file, "invoices");
  return imageUrl;
};

export const generatePdf = async (imageUrl) => {
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

export const handleFormChange = ({
  form,
  setFormValid,
  editState,
  isImageValid = true,
}) => {
  const hasErrors = form
    .getFieldsError()
    .some(({ errors }) => errors.length > 0);

  const values = form.getFieldsValue();
  const allFilled = Object.values(values).every(
    (val) => val !== undefined && val !== ""
  );

  const newValid =
    ((!hasErrors && allFilled && isImageValid) || (editState && !hasErrors)) ??
    false;

  setFormValid((prev) => (prev !== newValid ? newValid : prev));
};

export const validateUploadImage = (file, setIsImageValid) => {
  const isAllowedType =
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "image/jpg";
  const isLt1MB = file.size / 1024 / 1024 < 1;

  if (!isAllowedType) {
    Modal.error({
      title: "File tidak valid",
      content: "Hanya file JPG, JPEG, atau PNG yang diperbolehkan.",
      centered: true,
    });
    setIsImageValid(false);
    return Upload.LIST_IGNORE;
  }

  if (!isLt1MB) {
    Modal.error({
      title: "Ukuran file terlalu besar",
      content: "Ukuran gambar tidak boleh lebih dari 1MB.",
      centered: true,
    });
    setIsImageValid(false);
    return Upload.LIST_IGNORE;
  }

  setIsImageValid(true);
  return true;
};

// Function Handling API
export const logout = async () => {
  const res = await fetch("/api/auth/logout", { method: "POST" });
  const data = await res.json();
  if (res.ok) {
    window.location.href = "/login";
  } else {
    console.error(data.error);
  }
};

export async function uploadToVercelBlob(file, folder = "misc") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res = await fetch("/api/blob/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");

  const data = await res.json();
  return data.url; // your Vercel Blob public URL
}

export async function deleteVercelBlob(fileUrl) {
  const res = await fetch("/api/blob/delete", {
    method: "POST",
    body: JSON.stringify({ url: fileUrl }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Delete failed");
  }

  return true;
}

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

  const uploadFieldKey = values.fileUrl
    ? "fileUrl"
    : values.avatar
    ? "avatar"
    : null;
  const fileList = values[uploadFieldKey] || [];
  const file = fileList?.[0];
  let fileUrl = file?.url || null;

  setLoadingFetch(true);
  messageApi.open({ type: "loading", content: "Processing submit..." });

  try {
    // ⏳ If user selected a new file
    if (file?.originFileObj) {
      // 🗑️ Delete old image from Vercel Blob (if any)
      if (editState && editData?.[uploadFieldKey]) {
        try {
          await deleteVercelBlob(editData[uploadFieldKey]);
        } catch (err) {
          console.warn("Failed to delete old blob:", err.message);
          notification.error({
            message: err || `Failed to delete old blob`,
          });
        }
      }

      // 📤 Upload new image
      fileUrl = await uploadToVercelBlob(file.originFileObj, apiUri);
    }

    // 📝 Final payload with latest fileUrl
    const payload = {
      ...values,
      ...(uploadFieldKey && { [uploadFieldKey]: fileUrl }),
    };

    if (editState) {
      await axios.put(`/api/${apiUri}/${editData.key}`, payload);
    } else {
      await axios.post(`/api/${apiUri}`, payload);
    }

    notification.success({
      message: editState
        ? `${camelText(apiUri)} berhasil diubah!`
        : `${camelText(apiUri)} berhasil dibuat!`,
    });

    form.resetFields();
    setOpenModal && setOpenModal(false);
    setEditState && setEditState(false);
    setLoadingTable && setLoadingTable(true);
    router && router.refresh();
  } catch (error) {
    console.error(error);
    notification.error({ message: "Gagal menyimpan data!" });
  } finally {
    messageApi.destroy();
    setLoadingFetch(false);
    setLoadingTable && setTimeout(() => setLoadingTable(false), 500);
  }
};

export const globalDelete = async ({
  record,
  router,
  apiUri,
  messageApi,
  setLoadingTable,
  blobFields = ["fileUrl", "avatar"],
}) => {
  messageApi.open({
    type: "loading",
    content: "Processing delete...",
  });

  try {
    for (const field of blobFields) {
      const blobUrl = record?.[field];
      if (blobUrl) {
        try {
          await deleteVercelBlob(blobUrl);
        } catch (err) {
          console.warn(`Failed to delete ${field} blob:`, err.message);
          notification.error({
            message:
              typeof err === "string"
                ? err
                : err?.message || `Failed to delete ${field} blob`,
          });
        }
      }
    }
    await axios.delete(`/api/${apiUri}/${record.key}`);
    notification.success({ message: `${camelText(apiUri)} deleted!` });
    router.refresh();
    setLoadingTable(true);
  } catch (err) {
    notification.error({
      message: typeof err === "string" ? err : err?.message || "Delete failed",
    });
    console.log(err);
  } finally {
    messageApi.destroy;
    setTimeout(() => setLoadingTable(false), 500);
  }
};
