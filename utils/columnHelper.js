import { Flex, Image, Spin, Tag } from "antd";
import {
  camelText,
  generateFilters,
  getSorter,
  globalDelete,
} from "./functionHelper";
import { roleColors } from "./dataHelper";
import {
  AccountBookOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ButtonGeneric } from "@/components/button/buttonGeneric";
import { ModalConfirm, ModalInfo } from "@/components/modal/genericModal";

// Column Setup
export const columnsSetup = ({
  data,
  columnsConfig,
  propsHandle = {},
  propsValue = {},
  propsState = {},
}) => {
  return columnsConfig.map((col) => {
    // Handle action column render with propsHandle
    if (col.key === "action" && typeof col.render === "function") {
      return {
        ...col,
        fixed: "right",
        render: (_, record) =>
          col.render(record, propsHandle, propsValue, propsState),
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
      <Tag color={roleColors[role] || "default"}>{camelText(role)}</Tag>
    ),
  },
  {
    key: "createdAt",
    title: "Created at",
    dataIndex: "createdAt",
    type: "date",
  },
  {
    key: "updatedAt",
    title: "Updated at",
    dataIndex: "updatedAt",
    type: "date",
  },
  {
    key: "action",
    title: <Flex justify="center">Action</Flex>,
    render: (
      record,
      { showModal },
      { session, apiUri },
      { setEditState, setEditData, setLoadingTable, router }
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
              onOk: async () =>
                await globalDelete({ record, router, apiUri, setLoadingTable }),
            });
          }}
        />
      </Flex>
    ),
  },
];

export const columnMainConfig = [
  {
    key: "custName",
    title: "Customer Name",
    dataIndex: "custName",
    type: "string",
  },
  {
    key: "phone",
    title: "Phone",
    dataIndex: "phone",
    type: "string",
  },
  {
    key: "status",
    title: "Status",
    dataIndex: "status",
    type: "string",
    render: (status) => (
      <Tag color={status === "PAID" ? "green" : "orange"}>
        {camelText(status)}
      </Tag>
    ),
  },
  {
    key: "createdByName",
    title: "Created By",
    dataIndex: "createdByName",
    type: "string",
    customFn: (item) => item.createdBy?.name || item.createdById || "N/A",
  },
  {
    key: "createdAt",
    title: "Created At",
    dataIndex: "createdAt",
    type: "date",
  },
];

export const columnProductConfig = [
  {
    key: "name",
    title: "Product Name",
    dataIndex: "name",
    type: "string",
  },
  {
    key: "category",
    title: "Category",
    dataIndex: "category",
    type: "string",
    render: (data) => data.name,
  },
  {
    key: "description",
    title: "Description",
    dataIndex: "description",
    type: "string",
  },
  {
    key: "price",
    title: "Price",
    dataIndex: "price",
    type: "number",
  },
  {
    key: "stock",
    title: "Stock",
    dataIndex: "stock",
    type: "number",
  },
  {
    key: "image",
    title: "Image",
    dataIndex: "image",
    type: "string",
    customFn: (record) => (
      <Flex justify="center">
        <Image src={record.image} alt="Image Product" placeholder={<Spin />} />
      </Flex>
    ),
  },
  {
    key: "createdBy",
    title: "Created By",
    dataIndex: "createdBy",
    type: "string",
    customFn: (item) => item.createdBy?.name || item.createdById || "N/A",
  },
  {
    key: "createdAt",
    title: "Created At",
    dataIndex: "createdAt",
    type: "date",
  },
  {
    key: "updatedAt",
    title: "Updated At",
    dataIndex: "updatedAt",
    type: "date",
  },
  {
    key: "action",
    title: <Flex justify="center">Action</Flex>,
    render: (
      record,
      { showModal },
      { apiUri },
      { setEditState, setEditData, setLoadingTable, router }
    ) => (
      <Flex vertical justify="center" gap={8}>
        <ButtonGeneric
          variant="solid"
          color="yellow"
          icon={<AccountBookOutlined />}
          text="Invoice"
          disable={record.productInvoices.length == 0}
          onclick={() => {
            ModalInfo({
              title: `Invoices for "${record.name}"`,
              content: (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
                  {(record.productInvoices || []).map((inv, idx) => (
                    <Image
                      key={idx}
                      src={inv.invoice?.image}
                      alt={`Invoice ${idx + 1}`}
                      style={{ objectFit: "contain" }}
                    />
                  ))}
                </div>
              ),
              width: 600,
            });
          }}
        />
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
          onclick={() => {
            ModalConfirm({
              title: "Are you sure?",
              content: `Delete product "${record.name}"?`,
              okText: "Yes",
              cancelText: "Cancel",
              onOk: async () =>
                await globalDelete({
                  record,
                  router,
                  apiUri,
                  setLoadingTable,
                }),
            });
          }}
        />
      </Flex>
    ),
  },
];

export const columnCategoryConfig = [
  { title: "Category Name", dataIndex: "categoryName", type: "string" },
  { title: "Description", dataIndex: "description", type: "string" },
  { title: "Status", dataIndex: "status", type: "string" },
  { title: "Created Date", dataIndex: "createdDate", type: "date" },
];
