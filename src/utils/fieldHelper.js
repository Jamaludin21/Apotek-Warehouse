export const userFields = [
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
];

export const productFields = [
  {
    label: "Product Name",
    name: "name",
    type: "input",
    placeholder: "Enter product name",
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
];
