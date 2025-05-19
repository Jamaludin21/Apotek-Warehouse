import { Tag } from "antd";
import { generateFilters, getSorter } from "./functionHelper";
import { roleColors } from "./dataHelper";

// Column Setup
export const columnsSetup = ({ data, columnsConfig }) => {
  return columnsConfig.map(({ title, dataIndex, type, render }) => ({
    title,
    dataIndex,
    render,
    showSorterTooltip: { target: "full-header" },
    filters: generateFilters(dataIndex, data),
    onFilter: (value, record) => record[dataIndex] === value,
    sorter: getSorter(type, dataIndex),
    sortDirections: ["ascend", "descend"],
  }));
};

// Column Config
export const columnUsersConfig = [
  { key: "name", title: "Name", dataIndex: "name", type: "string" },
  { key: "email", title: "Email", dataIndex: "email", type: "string" },
  {
    key: "role",
    title: "Role",
    dataIndex: "role",
    type: "string",
    render: (role) => (
      <Tag color={roleColors[role] || "default"}>
        {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
      </Tag>
    ),
  },
  {
    key: "createdAt",
    title: "Created at",
    dataIndex: "createdAt",
    type: "date",
  },
];

export const columnMainConfig = [
  { title: "Medicine", dataIndex: "medicine", type: "string" },
  { title: "Quantity", dataIndex: "quantity", type: "number" },
  { title: "Price", dataIndex: "price", type: "number" },
  { title: "Date", dataIndex: "date", type: "date" },
];

export const columnProductConfig = [
  { title: "Name", dataIndex: "name", type: "string" },
  { title: "Category", dataIndex: "category", type: "string" },
  { title: "Stock", dataIndex: "stock", type: "number" },
  { title: "Price", dataIndex: "price", type: "number" },
  { title: "Status", dataIndex: "status", type: "string" },
  { title: "Created Date", dataIndex: "createdDate", type: "date" },
];

export const columnCategoryConfig = [
  { title: "Category Name", dataIndex: "categoryName", type: "string" },
  { title: "Description", dataIndex: "description", type: "string" },
  { title: "Status", dataIndex: "status", type: "string" },
  { title: "Created Date", dataIndex: "createdDate", type: "date" },
];
