"use client";

import { componentMap } from "@/utils/dataHelper";
import { handleFormChange } from "@/utils/functionHelper";
import { Col, Form, Input, Modal, Row, Select } from "antd";
import { useEffect } from "react";
import { ButtonGeneric } from "@/components/button/buttonGeneric";
import { PlusOutlined } from "@ant-design/icons";

const { confirm, info } = Modal;

export const GenericModalForm = ({
  propsHandle = {},
  propsValue = {},
  propsState = {},
}) => {
  const { handleSubmit, handleCancel } = propsHandle;
  const { setFormValid, setUploadFileList } = propsState;
  const {
    form,
    openModal,
    fields,
    FormValid,
    isImageValid,
    modalTitle,
    editState,
    editData,
    uploadFileList = [],
    loadingfetch,
    categoryOptions,
  } = propsValue;

  const transformEditData = (data) => {
    const transformed = {
      ...data,
      category: data.category?.id ?? data.categoryId ?? null,
    };

    // Only populate upload if fileUrl exists
    if (data.fileUrl) {
      transformed.fileUrl = [
        {
          uid: data.id || data.key,
          name: data.name || data.nama || data.judul || "uploaded file",
          status: "done",
          url: data.fileUrl,
        },
      ];
    }

    // Only populate upload if avatar exists
    if (data.avatar) {
      transformed.avatar = [
        {
          uid: data.id || data.key,
          name: data.name || data.nama || "uploaded file",
          status: "done",
          url: data.avatar,
        },
      ];
    }

    return transformed;
  };

  useEffect(() => {
    let transformedEdit;
    if (editState && editData) {
      transformedEdit = transformEditData(editData);
      if ((editData?.fileUrl || editData?.avatar) && setUploadFileList) {
        setUploadFileList(
          transformedEdit.fileUrl || transformedEdit.avatar || []
        );
      } else {
        setUploadFileList && setUploadFileList([]); // Reset on add new
      }
      form.setFieldsValue(transformedEdit);
    }
  }, [editState, editData, form, setUploadFileList]);

  return (
    <Modal
      title={modalTitle}
      open={openModal}
      okButtonProps={{ disabled: !FormValid }}
      onOk={handleSubmit}
      onCancel={handleCancel}
      cancelButtonProps={{ danger: true, disabled: loadingfetch }}
      confirmLoading={loadingfetch}
      destroyOnHidden
      centered={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFieldsChange={() =>
          handleFormChange({ form, setFormValid, editState, isImageValid })
        }
      >
        <Row gutter={16}>
          {fields &&
            fields.map((field) => {
              const Component = componentMap[field.type] || Input;
              return (
                <Col key={field.key} span={fields.length < 2 ? 24 : 12}>
                  <Form.Item
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    {...(field.type == "upload" && {
                      valuePropName: "fileList",
                      getValueFromEvent: (e) =>
                        Array.isArray(e) ? e : e?.fileList,
                    })}
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
                    ) : field.type === "upload" ? (
                      <Component
                        {...field.props}
                        showUploadList={{
                          showPreviewIcon:
                            uploadFileList.length > 0 &&
                            !!uploadFileList[0].url,
                          showRemoveIcon: true,
                          showDownloadIcon: false,
                        }}
                        onRemove={() => setUploadFileList([])}
                        fileList={uploadFileList}
                        accept=".jpg,.jpeg,.png"
                        onChange={({ fileList }) => {
                          const latestFile = fileList[fileList.length - 1];
                          if (
                            latestFile &&
                            latestFile.status !== "done" &&
                            !isImageValid
                          ) {
                            latestFile.status = "error";
                          }

                          handleFormChange({
                            form,
                            setFormValid,
                            editState,
                            isImageValid,
                          });
                          setUploadFileList(fileList);
                        }}
                      >
                        <ButtonGeneric
                          icon={<PlusOutlined />}
                          text="Upload"
                          type="link"
                        />
                      </Component>
                    ) : (
                      <Component
                        placeholder={field.placeholder}
                        {...field.props}
                        style={{ width: "100%" }}
                      />
                    )}
                  </Form.Item>
                </Col>
              );
            })}
        </Row>
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
    okButtonProps = {},
    cancelButtonProps = {},
    icon = "",
  } = props;
  return confirm({
    ...props,
    title: title,
    content: content,
    okText: okText,
    cancelText: cancelText,
    onOk: onOk,
    okButtonProps: okButtonProps,
    onCancel: onCancel,
    cancelButtonProps: cancelButtonProps,
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
