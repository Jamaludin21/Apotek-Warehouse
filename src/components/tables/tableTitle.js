import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex } from "antd";
import Title from "antd/es/typography/Title";

export const TableTitle = ({ title }) => {
  return (
    <Flex align="center" justify="space-between" className="w-full">
      <Title level={3} className="mb-0">
        {title}
      </Title>
      <Button type="primary" icon={<PlusOutlined />}>
        Add New
      </Button>
    </Flex>
  );
};
