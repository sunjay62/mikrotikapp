import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Modal, InputNumber, Select } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL_OLT } from "libs/auth-api";
import { useData } from "./useData";
import { useNavigate } from "react-router-dom";
import axiosInstance from "utils/axiosInstance";
const { Option } = Select;

const useCreate = ({ handleOpen, open }) => {
  const [name, setName] = useState("");
  const [assured, setAssured] = useState(null);
  const [type, setType] = useState(null);
  const [fixed, setFixed] = useState(null);
  const [maximum, setMaximum] = useState(null);
  const { refetch } = useData();
  const [inputsNotEmpty, setInputsNotEmpty] = useState(false);

  const resetForm = () => {
    setAssured(null);
    setName("");
    setType(null);
    setFixed(null);
    setMaximum(null);
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        name,
        assured,
        type,
        maximum,
        fixed,
      };

      console.log(formData);

      const response = await toast.promise(
        axiosInstance.post(
          `${BASE_URL_OLT}/speedprofile/tcont`,
          formData,
          config
        ),
        {
          pending: "Creating ...",
          success: "Created Successfully!",
        }
      );

      if (response.status === 201) {
        resetForm();
        handleOpen();
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    setInputsNotEmpty(
      name !== "" &&
        assured !== null &&
        type !== null &&
        maximum !== null &&
        fixed !== null
    );
  }, [name, assured, type, maximum, fixed]);

  return (
    <Modal
      title="Create New Speed Profile"
      open={open}
      onCancel={handleOpen}
      footer={[
        <Button
          key="confirm"
          className="mt-3 bg-blue-500 text-white"
          onClick={handleCreate}
          disabled={!inputsNotEmpty}
        >
          Confirm
        </Button>,
      ]}
    >
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> Name
      </Typography>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> Select Type
      </Typography>

      <Select
        placeholder="Select Type"
        value={type}
        onChange={(value) => setType(value)}
        className="w-full"
      >
        <Option value={1}>Fixed Bandwidth</Option>
        <Option value={2}>Assured Bandwidth</Option>
        <Option value={3}>Non-assured Bandwidth</Option>
        <Option value={4}>Best-Effort</Option>
        <Option value={5}>Hybrid Mode</Option>
      </Select>
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> Assured (Kbps)
      </Typography>
      <InputNumber
        placeholder="Assured"
        value={assured}
        onChange={(value) => setAssured(value)}
        className="w-full"
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> Fixed (Kbps)
      </Typography>
      <InputNumber
        placeholder="Fixed (Kbps)"
        value={fixed}
        onChange={(value) => setFixed(value)}
        className="w-full"
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> Maximum (Kbps)
      </Typography>
      <InputNumber
        placeholder="Maximum"
        value={maximum}
        onChange={(value) => setMaximum(value)}
        className="w-full"
      />
    </Modal>
  );
};

export default useCreate;
