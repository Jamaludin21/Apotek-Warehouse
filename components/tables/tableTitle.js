import { PlusOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import Title from "antd/es/typography/Title";
import { ButtonGeneric } from "@/components/button/buttonGeneric";

export const TableTitle = ({
  title,
  propsHandle = {},
  propsState = {},
  propsValue = {},
}) => {
  const { showModal, changesStep } = propsHandle;
  const { mainPage, transactionStep } = propsState;
  const { session } = propsValue;
  const keeperSession = session?.role == "KEEPER";
  return (
    <Flex align="center" justify="space-between" className="w-full">
      <Title level={3} className="mb-0">
        {title}
      </Title>
      {!mainPage && (
        <ButtonGeneric
          type="primary"
          icon={<PlusOutlined />}
          disable={keeperSession && !transactionStep}
          onclick={transactionStep ? changesStep : showModal}
          text="Add New"
        />
      )}
    </Flex>
  );
};
