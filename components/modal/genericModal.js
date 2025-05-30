"use client";

import { componentMap } from "../../utils/dataHelper";
import { Form, Input, Modal, Select } from "antd";
import { useEffect } from "react";

const { confirm, info } = Modal;

export const GenericModalForm = ({ propsHandle = {}, propsValue = {} }) => {
  const { handleSubmit, handleCancel } = propsHandle;
  const {
    form,
    openModal,
    fields,
    modalTitle,
    editState,
    editData,
    loadingfetch,
    categoryOptions,
  } = propsValue;

  const transformEditData = (data) => ({
    ...data,
    category: data.category?.id ?? data.categoryId ?? null,
  });

  useEffect(() => {
    if (editState && editData) {
      form.setFieldsValue(transformEditData(editData));
    }
  }, [editState, editData, form]);

  return (
    <Modal
      title={modalTitle}
      open={openModal}
      onOk={async () => await handleSubmit()}
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
                    {(categoryOptions.length > 0
                      ? categoryOptions
                      : field.options || []
                    ).map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </Component>
                ) : (
                  <Component
                    placeholder={field.placeholder}
                    {...field.props}
                    style={{ width: "100%" }}
                  />
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

export const ModalInfo = (props) => {
  const {
    title = "",
    content = "",
    okText = "",
    cancelText = "",
    onCancel,
    onOk,
    icon = "",
    width,
  } = props;
  return info({
    ...props,
    title: title,
    content: content,
    okText: okText,
    cancelText: cancelText,
    onOk: onOk,
    onCancel: onCancel,
    icon: icon,
    className: "centered-modal",
    width: width,
  });
};
