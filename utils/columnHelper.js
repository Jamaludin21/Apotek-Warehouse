import { Flex, Image, Spin, Tag } from "antd";
import {
  camelText,
  formatCurrency,
  formatDateTime,
  generateFilters,
  generatePdf,
  getSorter,
  globalDelete,
} from "./functionHelper";
import { roleColors } from "./dataHelper";
import {
  AccountBookOutlined,
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { ButtonGeneric } from "@/components/button/buttonGeneric";
import { ModalConfirm, ModalInfo } from "@/components/modal/genericModal";

const placeHolderSpin = (
  <Flex justify="center" align="center">
    <Spin />
  </Flex>
);

// Column Setup
export const columnsSetup = ({
  data,
  columnsConfig,
  propsHandle = {},
  propsValue = {},
  propsState = {},
}) => {
  const role = propsValue?.session?.role || "";
  return columnsConfig.map((col) => {
    // Handle action column render with propsHandle
    if (col.key === "action" && typeof col.render === "function") {
      return {
        ...col,
        fixed: "right",
        ...(Array.isArray(col.roles) &&
          !col.roles.includes(role) && { hidden: true }),
        render: (_, record) =>
          col.render(record, propsHandle, propsValue, propsState),
      };
    }

    if (col.type === "date") {
      return {
        ...col,
        render: (value) =>
          value ? (
            formatDateTime(value)
          ) : (
            <Tag color="warning">Tanggal tidak tersedia</Tag>
          ),
      };
    }

    // Handle single image
    if (col.type === "image") {
      return {
        ...col,
        render: (imageURL) =>
          imageURL ? (
            <Image
              src={imageURL}
              alt={col.title || "Image"}
              placeholder={placeHolderSpin}
            />
          ) : (
            <Image
              src="error"
              alt="Fault Image"
              fallback="data:image/png;base64,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"
            />
          ),
      };
    }

    // Handle multiple images
    if (col.type === "images") {
      return {
        ...col,
        render: (imageURLs) => {
          if (
            !imageURLs ||
            !Array.isArray(imageURLs) ||
            imageURLs.length === 0
          ) {
            return (
              <Image
                src="error"
                alt="No Images"
                fallback="data:image/png;base64,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"
              />
            );
          }

          return (
            <Image.PreviewGroup>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  maxWidth: "200px",
                }}
              >
                {imageURLs.slice(0, 3).map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    alt={`${col.title || "Image"} ${index + 1}`}
                    placeholder={placeHolderSpin}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                ))}
                {imageURLs.length > 3 && (
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "4px",
                      fontSize: "12px",
                      color: "#666",
                    }}
                  >
                    +{imageURLs.length - 3}
                  </div>
                )}
              </div>
            </Image.PreviewGroup>
          );
        },
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
  {
    key: "name",
    title: "Name",
    dataIndex: "name",
    type: "string",
    fixed: "left",
  },
  {
    key: "avatar",
    title: "Avatar",
    dataIndex: "avatar",
    type: "image",
    width: 75,
    height: 75,
  },
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
    fixed: "right",
    render: (
      record,
      { showModal },
      { session, apiUri, messageApi },
      { setEditState, setEditData, setLoadingTable, router }
    ) => (
      <Flex vertical justify="center" gap={8}>
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
              okButtonProps: { danger: true },
              cancelText: "Cancel",
              onOk: async () =>
                await globalDelete({
                  record,
                  router,
                  apiUri,
                  messageApi,
                  setLoadingTable,
                }),
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
    fixed: "left",
  },
  {
    key: "phone",
    title: "Phone",
    dataIndex: "phone",
    type: "string",
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
  {
    title: "Total Price",
    dataIndex: "items",
    key: "items",
    render: (items) => {
      const total = items?.reduce((sum, i) => sum + i.totalPrice, 0);
      return formatCurrency(total);
    },
  },
];

export const columnProductConfig = [
  {
    key: "name",
    title: "Product Name",
    dataIndex: "name",
    type: "string",
    fixed: "left",
  },
  {
    key: "fileUrl",
    title: "Product Image",
    dataIndex: "fileUrl",
    type: "image",
    width: 100,
    height: 75,
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
    render: (value) => formatCurrency(value),
  },
  {
    key: "stock",
    title: "Stock",
    dataIndex: "stock",
    type: "number",
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
    fixed: "right",
    roles: ["MANAGER"],
    page: "product",
    width: 200,
    render: (
      record,
      { showModal },
      { apiUri, messageApi },
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
                      src={inv.invoice?.fileUrl}
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
        <Flex justify="center" align="center" gap={4}>
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
                okButtonProps: { danger: true },
                cancelText: "Cancel",
                onOk: async () =>
                  await globalDelete({
                    record,
                    router,
                    apiUri,
                    messageApi,
                    setLoadingTable,
                  }),
              });
            }}
          />
        </Flex>
      </Flex>
    ),
  },
];

export const columnTransactionConfig = [
  {
    key: "custName",
    title: "Customer Name",
    dataIndex: "custName",
    type: "string",
    fixed: "left",
  },
  {
    key: "phone",
    title: "Phone Number",
    dataIndex: "phone",
    type: "string",
  },
  {
    key: "productNames",
    title: "Products",
    dataIndex: "productNames",
    type: "string",
  },
  {
    key: "productCategories",
    title: "Categories",
    dataIndex: "productCategories",
    type: "string",
  },

  {
    key: "productImages",
    title: "Images",
    dataIndex: "productImages",
    type: "images",
  },
  {
    key: "total",
    title: "Total Amount",
    dataIndex: "total",
    type: "currency",
    render: (total) => formatCurrency(total),
    sorter: (a, b) => a.total - b.total,
  },
  {
    key: "createdBy",
    title: "Created By",
    dataIndex: "createdBy",
    type: "string",
    render: (createdBy) => createdBy?.name || "N/A",
  },
  {
    key: "createdAt",
    title: "Created At",
    dataIndex: "createdAt",
    type: "date",
    render: (createdAt) => formatDateTime(createdAt),
    sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  },
  {
    key: "action",
    title: <Flex justify="center">Action</Flex>,
    fixed: "right",
    render: (record) => {
      const isImageAvailable = !!record.invoiceImageUrl;
      return (
        <Flex vertical justify="center" gap={8}>
          <ButtonGeneric
            danger={true}
            disabled={!isImageAvailable}
            icon={<FilePdfOutlined />}
            onclick={() => generatePdf(record.invoiceImageUrl)}
            text="Export as PDF"
          />
        </Flex>
      );
    },
  },
];

export const columnCategoryConfig = [
  {
    key: "name",
    title: "Category Name",
    dataIndex: "name",
    type: "string",
    width: 200,
    fixed: "left",
  },
  {
    key: "createdAt",
    title: "Created Date",
    dataIndex: "createdAt",
    type: "date",
  },
  {
    key: "updatedAt",
    title: "Updated Date",
    dataIndex: "updatedAt",
    type: "date",
  },
  {
    key: "action",
    title: <Flex justify="center">Action</Flex>,
    fixed: "right",
    width: 200,
    render: (
      record,
      _,
      { apiUri, messageApi },
      { setLoadingTable, router }
    ) => (
      <Flex justify="center" gap={8}>
        <ButtonGeneric
          danger
          onclick={() =>
            ModalConfirm({
              title: "Are you sure?",
              content: `Delete category "${record.name}"?`,
              okText: "Yes",
              okButtonProps: { danger: true },
              cancelText: "Cancel",
              onOk: async () =>
                await globalDelete({
                  record,
                  router,
                  apiUri,
                  messageApi,
                  setLoadingTable,
                }),
            })
          }
          text="Delete"
          icon={<DeleteOutlined />}
        />
      </Flex>
    ),
  },
];
