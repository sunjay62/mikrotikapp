import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Input, Modal, Row, Col, Select } from "antd";
import { useData } from "./useData";
import { BASE_URL_OLT } from "libs/auth-api";
import axiosInstance from "utils/axiosInstance";

const useCreate = ({ handleOpen, open }) => {
  const [form] = Form.useForm();
  const { refetch } = useData();
  const [name, setName] = useState("");
  const [gemport, setGemport] = useState("");
  const [ethernet, setEthernet] = useState("");
  const [tcont, setTcont] = useState("");
  const [maxSwitch, setMaxSwitch] = useState("");
  const [pots, setPots] = useState("");
  const [ipHost, setIpHost] = useState("");
  const [ponType, setPonType] = useState("");
  const [flow, setFlow] = useState("");
  const [wifi, setWifi] = useState("");
  const [description, setDescription] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        description: description,
        max_eth: ethernet || 0,
        max_flow: flow || 0,
        max_gemport: gemport || 0,
        max_iphost: ipHost || 0,
        max_pots: pots || 0,
        max_switch: maxSwitch || 0,
        max_tcont: tcont || 0,
        max_wifi: wifi || 0,
        name: name,
        pon_type: ponType,
      };

      const response = await toast.promise(
        axiosInstance.post(`${BASE_URL_OLT}/onutypes`, formData, config),
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
    setName("");
    handleOpen();
  };

  return (
    <Modal open={open} onCancel={handleCancel} width={850} footer={null}>
      <div className="flex justify-between pr-7">
        <h1 className="text-2xl font-bold">Create New Onu Type</h1>
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
              <span className="text-red-500">*</span> Name Onu Type
            </p>
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Name Onu Type is required" }]}
            >
              <Input
                style={commonStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1">
              <span className="text-red-500">*</span> PON Type
            </p>
            <Form.Item
              name="ponType"
              rules={[{ required: true, message: "PON Type is required" }]}
            >
              <Select
                style={commonStyle}
                value={ponType}
                onChange={(value) => setPonType(value)}
              >
                <Select.Option value="gpon">GPON</Select.Option>
                <Select.Option value="epon">EPON</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1">
              <span className="text-red-500">*</span> Maximum Gemport
            </p>
            <Form.Item
              name="gemport"
              rules={[
                { required: true, message: "Maximum Gemport is required" },
              ]}
            >
              <Input
                style={commonStyle}
                value={gemport}
                onChange={(e) => setGemport(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1">
              <span className="text-red-500">*</span> Maximum Ethernet
            </p>
            <Form.Item
              name="ethernet"
              rules={[
                { required: true, message: "Maximum Ethernet is required" },
              ]}
            >
              <Input
                style={commonStyle}
                value={ethernet}
                onChange={(e) => setEthernet(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1">
              <span className="text-red-500">*</span> Maximum Tcont
            </p>
            <Form.Item
              name="tcont"
              rules={[{ required: true, message: "Maximum Tcont is required" }]}
            >
              <Input
                style={commonStyle}
                value={tcont}
                onChange={(e) => setTcont(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1">
              <span className="text-red-500">*</span> Maximum Switch
            </p>
            <Form.Item
              name="maxSwitch"
              rules={[
                { required: true, message: "Maximum Switch is required" },
              ]}
            >
              <Input
                style={commonStyle}
                value={maxSwitch}
                onChange={(e) => setMaxSwitch(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1">
              <span className="text-red-500">*</span> Maximum Pots
            </p>
            <Form.Item
              name="pots"
              rules={[{ required: true, message: "Maximum Pots is required" }]}
            >
              <Input
                style={commonStyle}
                value={pots}
                onChange={(e) => setPots(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <p className="mb-1">
              <span className="text-red-500">*</span> Maximum IP Host
            </p>
            <Form.Item
              name="ipHost"
              rules={[
                { required: true, message: "Maximum IP Host is required" },
              ]}
            >
              <Input
                style={commonStyle}
                value={ipHost}
                onChange={(e) => setIpHost(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1">
              <span className="text-red-500">*</span> Maximum Flow
            </p>
            <Form.Item
              name="flow"
              rules={[{ required: true, message: "Maximum Flow is required" }]}
            >
              <Input
                style={commonStyle}
                value={flow}
                onChange={(e) => setFlow(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <p className="mb-1">
              <span className="text-red-500">*</span> Maximum WiFi
            </p>
            <Form.Item
              name="wifi"
              rules={[{ required: true, message: "Maximum WiFi is required" }]}
            >
              <Input
                style={commonStyle}
                value={wifi}
                onChange={(e) => setWifi(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <p className="mb-1">Description</p>
            <Form.Item name="description">
              <Input.TextArea
                style={commonStyle}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
