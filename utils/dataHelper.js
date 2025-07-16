import { DatePicker, Input, InputNumber, Select, Upload } from "antd";

export const roleColors = {
  MANAGER: "red",
  KEEPER: "blue",
};

export const roleOptions = [
  { label: "Manager", value: "MANAGER" },
  { label: "Keeper", value: "KEEPER" },
];

export const componentMap = {
  input: Input,
  textarea: Input.TextArea,
  number: InputNumber,
  select: Select,
  password: Input.Password,
  upload: Upload,
  date: DatePicker,
};
