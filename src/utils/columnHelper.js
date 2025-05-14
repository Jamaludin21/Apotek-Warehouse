// Sample column definitions and example usage of generic filtering/sorting
const generateFilters = (dataIndex, data) => {
  const uniqueValues = Array.from(new Set(data.map((item) => item[dataIndex])));
  return uniqueValues.map((val) => ({
    text: val,
    value: val,
  }));
};

export const columnsMain = (data) => [
  {
    title: "Medicine",
    dataIndex: "medicine",
    showSorterTooltip: { target: "full-header" },
    filters: generateFilters("medicine", data),
    onFilter: (value, record) => record.medicine.startsWith(value),
    sorter: (a, b) => a.medicine.localeCompare(b.medicine),
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    filters: generateFilters("quantity", data),
    onFilter: (value, record) => record.quantity === value,
    sorter: (a, b) => a.quantity - b.quantity,
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Price",
    dataIndex: "price",
    filters: generateFilters("price", data),
    onFilter: (value, record) => record.price === value,
    sorter: (a, b) => a.price - b.price,
    sortDirections: ["ascend", "descend"],
  },
  {
    title: "Date",
    dataIndex: "date",
    filters: generateFilters("date", data),
    onFilter: (value, record) => record.date === value,
    sorter: (a, b) => a.date.localeCompare(b.date),
    sortDirections: ["ascend", "descend"],
  },
];
