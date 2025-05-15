import { generateFilters, getSorter } from "./functionHelper";

// Column Setup
export const columnsSetup = ({ data, columnsConfig }) =>
  columnsConfig.map(({ title, dataIndex, type }) => ({
    title,
    dataIndex,
    showSorterTooltip: { target: "full-header" },
    filters: generateFilters(dataIndex, data),
    onFilter: (value, record) => record[dataIndex] === value,
    sorter: getSorter(type, dataIndex),
    sortDirections: ["ascend", "descend"],
  }));

// Column Config
export const columnUsersConfig = [
  { title: "Name", dataIndex: "name", type: "string" },
  { title: "Email", dataIndex: "email", type: "string" },
  { title: "Role", dataIndex: "role", type: "string" },
  { title: "Status", dataIndex: "status", type: "string" },
  { title: "Registered Date", dataIndex: "registeredDate", type: "date" },
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
