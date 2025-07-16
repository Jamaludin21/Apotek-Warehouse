import { columnsSetup } from "@/utils/columnHelper";
import { Table } from "antd";
import { TableTitle } from "./tableTitle";
import React, { useEffect } from "react";
import { GenericModalForm } from "@/components/modal/genericModal";

export const GenericTable = ({
  title,
  data,
  config,
  propsHandle = {},
  propsValue = {},
  propsState = {},
}) => {
  const { setScrollY } = propsState;
  const { scrollY } = propsValue;

  useEffect(() => {
    const updateScrollY = () => {
      const offset = 350; // Adjust this value based on your header, footer, etc.
      const height = window.innerHeight - offset;
      setScrollY(height > 300 ? height : 300); // minimum height guard
    };

    updateScrollY(); // initial
    window.addEventListener("resize", updateScrollY);

    return () => window.removeEventListener("resize", updateScrollY);
  }, [setScrollY]);

  return (
    <React.Fragment>
      <Table
        title={() => (
          <TableTitle
            title={title}
            propsValue={propsValue}
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
        scroll={{ x: 1600, y: scrollY }}
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
