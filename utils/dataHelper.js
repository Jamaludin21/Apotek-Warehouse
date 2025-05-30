import { Input, InputNumber, Select, Upload } from "antd";

export const dataMain = [
  {
    key: "1",
    medicine: "Paracetamol",
    quantity: 100,
    price: 5000,
    date: "2024-05-10",
  },
  {
    key: "2",
    medicine: "Ibuprofen",
    quantity: 50,
    price: 7500,
    date: "2024-05-11",
  },
  {
    key: "3",
    medicine: "Amoxicillin",
    quantity: 30,
    price: 12000,
    date: "2024-05-12",
  },
  {
    key: "4",
    medicine: "Cetirizine",
    quantity: 75,
    price: 6500,
    date: "2024-05-13",
  },
];

export const dataProducts = [
  {
    key: "1",
    name: "Vitamin C",
    category: "Supplements",
    stock: 120,
    price: 15000,
    status: "Available",
    createdDate: "2024-05-10",
  },
  {
    key: "2",
    name: "Antibiotic Cream",
    category: "Topical",
    stock: 80,
    price: 22000,
    status: "Available",
    createdDate: "2024-05-11",
  },
  {
    key: "3",
    name: "Cough Syrup",
    category: "Liquid",
    stock: 40,
    price: 18000,
    status: "Out of Stock",
    createdDate: "2024-05-12",
  },
  {
    key: "4",
    name: "Pain Relief Gel",
    category: "Topical",
    stock: 65,
    price: 20000,
    status: "Available",
    createdDate: "2024-05-13",
  },
];

export const dataCategories = [
  {
    key: "1",
    categoryName: "Supplements",
    description: "Health supplements and vitamins",
    status: "Active",
    createdDate: "2024-05-09",
  },
  {
    key: "2",
    categoryName: "Topical",
    description: "Creams, gels, and ointments",
    status: "Active",
    createdDate: "2024-05-10",
  },
  {
    key: "3",
    categoryName: "Liquid",
    description: "Syrups and liquid medicines",
    status: "Inactive",
    createdDate: "2024-05-11",
  },
];

export const roleColors = {
  MANAGER: "red",
  KEEPER: "blue",
};

export const roleOptions = [
  { label: "Manager", value: "MANAGER" },
  { label: "Keeper", value: "KEEPER" },
];

export const componentMap = {
  input: Input,
  textarea: Input.TextArea,
  number: InputNumber,
  select: Select,
  password: Input.Password,
  upload: Upload,
};
