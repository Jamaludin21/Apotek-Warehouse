import { columnsSetup } from "@/utils/columnHelper";
import { Card, Table } from "antd";
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
      <Card>
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
          loading={loadingTable && { tip: "loading..." }}
        />
      </Card>
      <GenericModalForm
        propsHandle={propsHandle}
        propsValue={propsValue}
        propsState={propsState}
      />
    </React.Fragment>
  );
};
