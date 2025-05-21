"use client";

import { componentMap } from "@/utils/dataHelper";
import { Form, Modal, Select } from "antd";
import { useEffect } from "react";

const { confirm } = Modal;

export const GenericModalForm = ({
  propsHandle = {},
  propsValue = {},
  initialValues = {},
}) => {
  const { handleSubmit, handleCancel } = propsHandle;
  const {
    form,
    openModal,
    fields,
    modalTitle,
    editState,
    editData,
    loadingfetch,
  } = propsValue;

  useEffect(() => {
    if (openModal) {
      if (editData && editState) form.setFieldsValue(editData);
      else form.setFieldsValue(initialValues);
    }
  }, [openModal, initialValues, form, editData, editState]);

  return (
    <Modal
      title={modalTitle}
      open={openModal}
      onOk={async () => {
        const success = await handleSubmit();
        if (!success) return;
      }}
      onCancel={handleCancel}
      confirmLoading={loadingfetch}
      destroyOnHidden
      className="centered-modal"
    >
      <Form form={form} layout="vertical">
        {fields &&
          fields.map((field) => {
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

export const ModalConfirm = (props) => {
  const {
    title = "",
    content = "",
    okText = "",
    cancelText = "",
    onCancel,
    onOk,
    icon = "",
  } = props;
  return confirm({
    ...props,
    title: title,
    content: content,
    okText: okText,
    cancelText: cancelText,
    onOk: onOk,
    onCancel: onCancel,
    icon: icon,
    className: "centered-modal",
  });
};
