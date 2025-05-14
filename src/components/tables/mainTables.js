import React from "react";
import { Table, Typography } from "antd";
import { dataMain } from "@/utils/dataHelper";
import { columnsMain } from "@/utils/columnHelper";

const { Title } = Typography;

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

export const MainTable = () => (
  <Table
    columns={columnsMain(dataMain)}
    dataSource={dataMain}
    onChange={onChange}
    title={() => (
      <Title level={3} className="mb-0">
        Recent Sale List
      </Title>
    )}
    showSorterTooltip={{ target: "sorter-icon" }}
    pagination={dataMain.length <= 10 && false}
  />
);
