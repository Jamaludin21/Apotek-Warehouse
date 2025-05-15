import { columnsSetup } from "@/utils/columnHelper";
import { Table } from "antd";
import Title from "antd/es/typography/Title";

export const GenericTable = ({ title, data, config }) => (
  <Table
    title={() => <Title level={3}>{title}</Title>}
    columns={columnsSetup({ data, columnsConfig: config })}
    dataSource={data}
    showSorterTooltip={{ target: "sorter-icon" }}
    pagination={data.length <= 10 && false}
  />
);
