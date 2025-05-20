export const userFields = [
  {
    label: "Name",
    name: "name",
    type: "input",
    placeholder: "Enter name",
    rules: [{ required: true }],
  },
  {
    label: "Username",
    name: "username",
    type: "input",
    placeholder: "Enter username",
    rules: [{ required: true }],
  },
  {
    label: "Email",
    name: "email",
    type: "input",
    placeholder: "Enter email",
    rules: [{ required: true, type: "email" }],
  },
];
