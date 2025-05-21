import { Flex, message, Tag } from "antd";
import { generateFilters, getSorter } from "./functionHelper";
import { roleColors } from "./dataHelper";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ButtonGeneric } from "@/components/button/buttonGeneric";
import { ModalConfirm } from "@/components/modal/genericModal";
import axios from "axios";

// Column Setup
export const columnsSetup = ({
  data,
  columnsConfig,
  propsHandle = {},
  propsValue = {},
}) => {
  return columnsConfig.map((col) => {
    // Handle action column render with propsHandle
    if (col.key === "action" && typeof col.render === "function") {
      return {
        ...col,
        fixed: "right",
        render: (_, record) => col.render(record, propsHandle, propsValue),
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
  { key: "username", title: "Username", dataIndex: "username", type: "string" },
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
    render: (
      record,
      { showModal, setEditState, setEditData, router, handleSubmit },
      { session }
    ) => (
      <Flex justify="center" gap={8}>
        <ButtonGeneric
          variant="solid"
          color="green"
          icon={<EditOutlined />}
          text=" Edit"
          onclick={async () => {
            setEditState(true);
            setEditData(record);
            showModal();
          }}
        />
        <ButtonGeneric
          variant="solid"
          color="red"
          icon={<DeleteOutlined />}
          text="Delete"
          disable={session.email === record.email}
          onclick={() => {
            ModalConfirm({
              title: "Are you sure?",
              content: `Delete user "${record.name}"?`,
              okText: "Yes",
              cancelText: "Cancel",
              onOk: async () => {
                try {
                  await axios.delete(`/api/users/${record.id}`);
                  message.success("User deleted");
                  router.refresh();
                } catch (err) {
                  message.error(err?.response?.data?.error || "Delete failed");
                }
              },
            });
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
