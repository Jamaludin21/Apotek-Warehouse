import { columnsSetup } from "@/utils/columnHelper";
import { Table } from "antd";
import { TableTitle } from "./tableTitle";
import React from "react";
import { GenericModalForm } from "../modal/genericModal";

export const GenericTable = ({
  title,
  data,
  config,
  propsHandle = {},
  propsValue = {},
}) => {
  return (
    <React.Fragment>
      <Table
        title={() => (
          <TableTitle
            title={title}
            propsValue={propsValue}
            propsHandle={propsHandle}
          />
        )}
        columns={columnsSetup({ data, columnsConfig: config, propsHandle })}
        dataSource={data}
        showSorterTooltip={{ target: "sorter-icon" }}
        pagination={data.length <= 10 && false}
      />
      <GenericModalForm propsHandle={propsHandle} propsValue={propsValue} />
    </React.Fragment>
  );
};
