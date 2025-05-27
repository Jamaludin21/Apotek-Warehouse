import { columnsSetup } from "@/utils/columnHelper";
import { Table } from "antd";
import { TableTitle } from "./tableTitle";
import React from "react";
import { GenericModalForm } from "@/components/modal/genericModal";

export const GenericTable = ({
  title,
  data,
  config,
  propsHandle = {},
  propsValue = {},
  propsState = {},
}) => {
  return (
    <React.Fragment>
      <Table
        title={() => (
          <TableTitle
            title={title}
            propsHandle={propsHandle}
            propsState={propsState}
          />
        )}
        columns={columnsSetup({
          data,
          columnsConfig: config,
          propsHandle,
          propsValue,
          propsState,
        })}
        dataSource={data}
        showSorterTooltip={{ target: "sorter-icon" }}
        scroll={{ x: 991 }}
        pagination={data.length > 10 && { pageSize: 10 }}
      />
      <GenericModalForm
        propsHandle={propsHandle}
        propsValue={propsValue}
        propsState={propsState}
      />
    </React.Fragment>
  );
};
