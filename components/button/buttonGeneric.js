import { Button } from "antd";

export const ButtonGeneric = ({
  variant = "",
  color = "",
  icon = "",
  onclick,
  text = "",
  type = "",
  key = "",
  disable = false,
  loading = false,
  danger = false,
}) => {
  return (
    <Button
      key={key}
      type={type}
      variant={variant}
      color={color}
      icon={icon}
      onClick={onclick}
      disabled={disable}
      loading={loading}
      danger={danger}
    >
      {text}
    </Button>
  );
};
