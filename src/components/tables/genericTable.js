import { columnsSetup } from "@/utils/columnHelper";
import { Table } from "antd";
import { TableTitle } from "./tableTitle";

export const GenericTable = ({ title, data, config }) => (
  <Table
    title={() => <TableTitle title={title} />}
    columns={columnsSetup({ data, columnsConfig: config })}
    dataSource={data}
    showSorterTooltip={{ target: "sorter-icon" }}
    pagination={data.length <= 10 && false}
  />
);
