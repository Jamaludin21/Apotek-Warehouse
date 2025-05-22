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
  propsState = {},
}) => {
  const { loadingTable } = propsValue;
  return (
    <React.Fragment>
      <Table
        title={() => <TableTitle title={title} propsHandle={propsHandle} />}
        columns={columnsSetup({
          data,
          columnsConfig: config,
          propsHandle,
          propsValue,
          propsState,
        })}
        dataSource={data}
        showSorterTooltip={{ target: "sorter-icon" }}
        pagination={data.length <= 10 && false}
        scroll={{ x: 991 }}
        loading={loadingTable && { tip: "loading..." }}
      />
      <GenericModalForm
        propsHandle={propsHandle}
        propsValue={propsValue}
        propsState={propsState}
      />
    </React.Fragment>
  );
};
