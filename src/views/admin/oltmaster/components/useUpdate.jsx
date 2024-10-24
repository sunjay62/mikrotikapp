import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Form, Input, Select, Modal, Row, Col } from "antd";
import moment from "moment";
import { useData } from "./useData";
import { BASE_URL_OLT } from "libs/auth-api";
import axiosInstance from "utils/axiosInstance";

const useUpdate = ({ handleOpenEdit, openEdit, items }) => {
  const [form] = Form.useForm();
  const { refetch } = useData();
  const [id, setId] = useState("");
  const [merk, setMerk] = useState("");
  const [model, setModel] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (items) {
      setId(items.id || "");
      setMerk(items.merk || "");
      setModel(items.model || "");
    }
  }, [items]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        id: id,
        merk: merk,
        model: model,
      };

      console.log(formData);
      const response = await toast.promise(
        axiosInstance.put(`${BASE_URL_OLT}/oltmaster/merk`, formData, config),
        {
          pending: "Updating ...",
          success: "Updated Successfully!",
        }
      );

      console.log(response);

      if (response.status === 200) {
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
    handleOpenEdit();
  };

  useEffect(() => {
    // Check if all required fields are filled
    if (merk && model) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [merk, model]);

  return (
    <Modal open={openEdit} onCancel={handleCancel} width={850} footer={null}>
      <div className="flex justify-between pr-7">
        <h1 className="text-2xl font-bold">Edit OLT Master</h1>
      </div>
      <Form
        form={form}
        name="control-hooks-update"
        style={{
          maxWidth: 800,
        }}
        onFinish={handleUpdate}
      >
        <Row gutter={16}>
          <Col span={12}>
            <p className="mb-1 mt-3">
              <span className="text-red-500">*</span> Merk Name
            </p>

            <Input
              style={commonStyle}
              value={merk}
              onChange={(e) => setMerk(e.target.value)}
            />
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3">
              <span className="text-red-500">*</span> Model
            </p>

            <Input
              style={commonStyle}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </Col>

          <Col span={24}>
            <div className="mt-3 flex items-end  justify-end">
              <Button
                className="bg-blue-500 text-white"
                htmlType="submit"
                disabled={!isFormValid}
              >
                Update
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default useUpdate;
