import { Flex, Tag } from "antd";
import { generateFilters, getSorter } from "./functionHelper";
import { roleColors } from "./dataHelper";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ButtonGeneric } from "@/components/button/buttonGeneric";

// Column Setup
export const columnsSetup = ({ data, columnsConfig, propsHandle = {} }) => {
  return columnsConfig.map((col) => {
    // Handle action column render with propsHandle
    if (col.key === "action" && typeof col.render === "function") {
      return {
        ...col,
        render: (_, record) => col.render(record, propsHandle),
      };
    }

    return {
      ...col,
      filters: generateFilters(col.dataIndex, data),
      onFilter: (value, record) => record[col.dataIndex] === value,
      sorter: getSorter(col.type, col.dataIndex),
      sortDirections: ["ascend", "descend"],
      showSorterTooltip: { target: "full-header" },
    };
  });
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
  {
    key: "action",
    title: <Flex justify="center">Action</Flex>,
    render: (record, { showModal, setEditState, setEditData }) => (
      <Flex justify="center" gap={8}>
        <ButtonGeneric
          variant="solid"
          color="green"
          icon={<EditOutlined />}
          text=" Edit"
          onclick={() => {
            setEditState(true);
            setEditData(record);
            showModal(record);
          }}
        />
        <ButtonGeneric
          variant="solid"
          color="red"
          icon={<DeleteOutlined />}
          text="Delete"
          onclick={() => {
            // You can add confirmation logic here
            console.log("Deleting", record);
          }}
        />
      </Flex>
    ),
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
