import { Col, Card, Flex, Typography } from "antd";
import React from "react";

const { Text } = Typography;

export const SummaryCard = ({ propsCount }) => {
  const { usersCount, productsCount, categoriesCount, transactionsCount } =
    propsCount;

  const summaryData = [
    { label: "Total Users", value: usersCount || 0 },
    { label: "Total Product", value: productsCount || 0 },
    { label: "Total Category", value: categoriesCount || 0 },
    { label: "Total Transaction", value: transactionsCount || 0 },
  ];

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
