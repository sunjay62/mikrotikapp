import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Input, Select, Modal, Row, Col } from "antd";
import moment from "moment";
import { useData } from "./useData";
import { BASE_URL_OLT } from "libs/auth-api";
import axiosInstance from "utils/axiosInstance";

const useCreate = ({ handleOpen, open }) => {
  const [form] = Form.useForm();
  const { refetch } = useData();
  const [merk, setMerk] = useState("");
  const [model, setModel] = useState("");

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        model: model,
        merk: merk,
      };

      const response = await toast.promise(
        axiosInstance.post(`${BASE_URL_OLT}/oltmaster/merk`, formData, config),
        {
          pending: "Creating ...",
          success: "Created Successfully!",
        }
      );

      if (response.status === 201) {
        handleCancel();
        refetch();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.log(error);
    }
  };

  const commonStyle = {
    width: "100%",
  };

  const handleCancel = () => {
    form.resetFields();
    setMerk("");
    setModel("");
    handleOpen();
  };

  return (
    <Modal open={open} onCancel={handleCancel} width={850} footer={null}>
      <div className="flex justify-between pr-7">
        <h1 className="text-2xl font-bold">Create New OLT Model</h1>
      </div>
      <Form
        form={form}
        name="control-hooks-create"
        style={{
          maxWidth: 800,
        }}
        className="mt-10"
        onFinish={handleCreate}
      >
        <Row gutter={16}>
          <Col span={12}>
            <p className="mb-1">
              <span className="text-red-500">*</span> Merk Name
            </p>
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Merk Name is required" }]}
            >
              <Input
                style={commonStyle}
                value={merk}
                onChange={(e) => setMerk(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1">
              <span className="text-red-500">*</span> Model
            </p>
            <Form.Item
              name="gemport"
              rules={[{ required: true, message: "Model is required" }]}
            >
              <Input
                style={commonStyle}
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <div className="flex items-end justify-end">
              <Button className="bg-blue-500 text-white" htmlType="submit">
                Create
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default useCreate;
