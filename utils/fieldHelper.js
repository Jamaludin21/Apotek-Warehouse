import { validateUploadImage } from "./functionHelper";

export const userFields = (setIsImageValid) => [
  {
    label: "Name",
    name: "name",
    type: "input",
    placeholder: "Enter name",
    rules: [{ required: true }],
  },

  {
    label: "Username",
    name: "username",
    type: "input",
    placeholder: "Enter username",
    rules: [{ required: true }],
  },
  {
    label: "Email",
    name: "email",
    type: "input",
    placeholder: "Enter email",
    rules: [{ required: true, type: "email" }],
  },
  {
    name: "avatar",
    label: "Upload Image",
    type: "upload",
    required: true,
    rules: [{ required: true, message: "Image must be uploaded" }],
    props: {
      listType: "picture-card",
      maxCount: 1,
      beforeUpload: (file) => validateUploadImage(file, setIsImageValid),
    },
  },
];

export const productFields = (setIsImageValid) => [
  {
    label: "Product Name",
    name: "name",
    type: "input",
    placeholder: "Enter product name",
    rules: [{ required: true }],
  },
  {
    label: "Category",
    name: "category",
    type: "select",
    rules: [{ required: true }],
    props: {
      allowClear: true,
    },
  },
  {
    label: "Price",
    name: "price",
    type: "number",
    placeholder: "Enter price",
    rules: [{ required: true }],
  },
  {
    label: "Stock",
    name: "stock",
    type: "number",
    placeholder: "Enter stock quantity",
    rules: [{ required: true }],
  },
  {
    label: "Description",
    name: "description",
    type: "textarea",
    placeholder: "Enter product description",
    rules: [{ required: true }],
  },
  {
    name: "fileUrl",
    label: "Upload Image",
    type: "upload",
    required: true,
    rules: [{ required: true, message: "Image must be uploaded" }],
    props: {
      listType: "picture-card",
      maxCount: 1,
      beforeUpload: (file) => validateUploadImage(file, setIsImageValid),
    },
  },
];

export const categoryFields = [
  {
    label: "Category Name",
    name: "name",
    type: "input",
    placeholder: "Enter category name",
    rules: [{ required: true }],
  },
];
