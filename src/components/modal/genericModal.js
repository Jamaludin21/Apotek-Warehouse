import { componentMap } from "@/utils/dataHelper";
import { Form, Modal, Select } from "antd";
import { useEffect } from "react";

export const GenericModalForm = ({
  propsHandle = {},
  propsValue = {},
  initialValues = {},
}) => {
  const { handleSubmit, handleCancel } = propsHandle;
  const { form, openModal, fields, modalTitle } = propsValue;

  useEffect(() => {
    if (openModal) {
      form.setFieldsValue(initialValues);
    }
  }, [openModal, initialValues, form]);

  return (
    <Modal
      title={modalTitle}
      open={openModal}
      onOk={handleSubmit}
      onCancel={handleCancel}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {fields.map((field) => {
          const Component = componentMap[field.type] || Input;
          return (
            <Form.Item
              key={field.name}
              label={field.label}
              name={field.name}
              rules={field.rules || []}
            >
              {field.type === "select" ? (
                <Component {...field.props}>
                  {(field.options || []).map((opt) => (
                    <Select.Option key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Option>
                  ))}
                </Component>
              ) : (
                <Component placeholder={field.placeholder} {...field.props} />
              )}
            </Form.Item>
          );
        })}
      </Form>
    </Modal>
  );
};
