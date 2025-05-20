import { Button } from "antd";

export const ButtonGeneric = ({
  variant = "",
  color = "",
  icon = "",
  onclick,
  text = "",
  type = "",
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      icon={icon}
      onClick={onclick}
    >
      {text}
    </Button>
  );
};
