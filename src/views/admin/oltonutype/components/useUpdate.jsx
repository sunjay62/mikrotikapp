import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Form, Input, Select, Modal, Row, Col } from "antd";
import { useData } from "./useData";
import { BASE_URL_OLT } from "libs/auth-api";
import axiosInstance from "utils/axiosInstance";

const useUpdate = ({ handleOpenEdit, openEdit, items }) => {
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
  const [id, setId] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (items) {
      setId(items.id || "");
      setName(items.name || "");
      setGemport(items.max_gemport || "");
      setEthernet(items.max_eth || "");
      setTcont(items.max_tcont || "");
      setMaxSwitch(items.max_switch || "");
      setPots(items.max_pots || "");
      setIpHost(items.max_iphost || "");
      setPonType(items.pon_type || "");
      setFlow(items.max_flow || "");
      setWifi(items.max_wifi || "");
      setDescription(items.description || "");
    }
  }, [items]);

  useEffect(() => {
    // Check if all required fields are filled
    if (
      name &&
      gemport &&
      ethernet &&
      tcont &&
      maxSwitch &&
      pots &&
      ipHost &&
      ponType &&
      flow &&
      wifi
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [
    name,
    gemport,
    ethernet,
    tcont,
    maxSwitch,
    pots,
    ipHost,
    ponType,
    flow,
    wifi,
  ]);

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

      console.log(formData);
      const response = await toast.promise(
        axiosInstance.put(`${BASE_URL_OLT}/onutypes`, formData, config),
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
    setName("");
    handleOpenEdit();
  };

  return (
    <Modal open={openEdit} onCancel={handleCancel} width={850} footer={null}>
      <div className="flex justify-between pr-7">
        <h1 className="text-2xl font-bold">Edit Onu Type</h1>
      </div>
      <Form
        form={form}
        name="control-hooks-create"
        style={{
          maxWidth: 800,
        }}
        onFinish={handleUpdate}
      >
        <Row gutter={16}>
          <Col span={12}>
            <p className="mb-1 mt-3">
              <span className="text-red-500">*</span> Name Onu Type
            </p>
            <Input
              style={commonStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3">
              <span className="text-red-500">*</span> PON Type
            </p>

            <Select
              style={commonStyle}
              value={ponType}
              onChange={(value) => setPonType(value)}
            >
              <Select.Option value="gpon">GPON</Select.Option>
              <Select.Option value="epon">EPON</Select.Option>
            </Select>
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3">
              <span className="text-red-500">*</span> Maximum Gemport
            </p>
            <Input
              style={commonStyle}
              value={gemport}
              onChange={(e) => setGemport(e.target.value)}
            />
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3">
              <span className="text-red-500">*</span> Maximum Ethernet
            </p>
            <Input
              style={commonStyle}
              value={ethernet}
              onChange={(e) => setEthernet(e.target.value)}
            />
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3">
              <span className="text-red-500">*</span> Maximum Tcont
            </p>
            <Input
              style={commonStyle}
              value={tcont}
              onChange={(e) => setTcont(e.target.value)}
            />
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3">
              <span className="text-red-500">*</span> Maximum Switch
            </p>
            <Input
              style={commonStyle}
              value={maxSwitch}
              onChange={(e) => setMaxSwitch(e.target.value)}
            />
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3">
              <span className="text-red-500">*</span> Maximum Pots
            </p>
            <Input
              style={commonStyle}
              value={pots}
              onChange={(e) => setPots(e.target.value)}
            />
          </Col>
          <Col span={12}>
            <p className="mb-1 mt-3">
              <span className="text-red-500">*</span> Maximum IP Host
            </p>
            <Input
              style={commonStyle}
              value={ipHost}
              onChange={(e) => setIpHost(e.target.value)}
            />
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3">
              <span className="text-red-500">*</span> Maximum Flow
            </p>
            <Input
              style={commonStyle}
              value={flow}
              onChange={(e) => setFlow(e.target.value)}
            />
          </Col>
          <Col span={12}>
            <p className="mb-1 mt-3">
              <span className="text-red-500">*</span> Maximum WiFi
            </p>
            <Input
              style={commonStyle}
              value={wifi}
              onChange={(e) => setWifi(e.target.value)}
            />
          </Col>

          <Col span={24}>
            <p className="mb-1 mt-3">Description</p>
            <Input.TextArea
              style={commonStyle}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Col>

          <Col span={24}>
            <div className="mt-3 flex items-end justify-end">
              <Button
                className="bg-blue-500 text-white"
                htmlType="submit"
                disabled={!isFormValid} // Button disabled based on form validation
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
