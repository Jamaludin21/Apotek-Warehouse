import { Col, Card, Flex, Typography } from "antd";
import React from "react";

const { Text } = Typography;

const summaryData = [
  { label: "Total Users", value: 1 },
  { label: "Total Product", value: 2 },
  { label: "Total Category", value: 2 },
  { label: "Total Order", value: 2 },
];

export const SummaryCard = () => {
  return (
    <React.Fragment>
      {summaryData.map((item) => (
        <Col key={item.label} xxl={6} xl={6} lg={12} md={12} sm={24} xs={24}>
          <Card>
            <Flex vertical>
              <Flex justify="space-between">
                <Text className="text-secondary font-medium">{item.label}</Text>
              </Flex>
              <Text className="text-3-xl font-medium">{item.value}</Text>
            </Flex>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  );
};
