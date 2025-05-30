import { PlusOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import { ButtonGeneric } from "../button/buttonGeneric";

export const TableTitle = ({ title, propsHandle = {}, propsState = {} }) => {
  const { showModal } = propsHandle;
  const { mainPage } = propsState;
  return (
    <Flex align="center" justify="space-between" className="w-full">
      <Title level={3} className="mb-0">
        {title}
      </Title>
      {!mainPage && (
        <ButtonGeneric
          type="primary"
          icon={<PlusOutlined />}
          onclick={showModal}
          text="Add New"
        />
      )}
    </Flex>
  );
};
