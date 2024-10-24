import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Modal, Select } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL_OLT } from "libs/auth-api";
import { useData } from "./useData";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "utils/axiosInstance";
const { Option } = Select;

const useUpdate = ({ handleOpenEdit, openEdit, items }) => {
  const [decodedToken, setDecodedToken] = useState({});
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [assured, setAssured] = useState("");
  const [type, setType] = useState("");
  const [fixed, setFixed] = useState("");
  const [maximum, setMaximum] = useState("");
  const { refetch } = useData();
  const [inputsNotEmpty, setInputsNotEmpty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (items) {
      setId(items.id || "");
      setName(items.name || "");
      setAssured(items.assured || "");
      setType(items.type || "");
      setFixed(items.fixed || "");
      setMaximum(items.maximum || "");
      setInputsNotEmpty(true); // Set to true when data is loaded
    }
  }, [items]);

  useEffect(() => {
    // Check if all required fields are filled
    const allFieldsFilled = name && assured && type && fixed && maximum;
    setInputsNotEmpty(allFieldsFilled);
  }, [name, assured, type, fixed, maximum]);

  const resetForm = () => {
    setAssured("");
    setName("");
    setType("");
    setFixed("");
    setMaximum("");
    setInputsNotEmpty(false);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        id,
        name,
        assured,
        type,
        maximum,
        fixed,
      };

      console.log(formData);

      const response = await toast.promise(
        axiosInstance.put(
          `${BASE_URL_OLT}/speedprofile/tcont`,
          formData,
          config
        ),
        {
          pending: "Updating ...",
          success: "Updated Successfully!",
        }
      );

      if (response.status === 200) {
        resetForm();
        handleOpenEdit();
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
      console.log(error);
    }
  };

  useEffect(() => {
    // Reset form when the modal is closed
    if (!openEdit) {
      resetForm();
    }
  }, [openEdit]);

  return (
    <Modal
      title="Edit Account"
      open={openEdit}
      onCancel={handleOpenEdit}
      afterClose={resetForm}
      footer={[
        <Button
          key="confirm"
          className="bg-blue-500 text-white"
          onClick={handleUpdate}
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
        placeholder=" Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> Select Type
      </Typography>
      <Select
        placeholder="Select Type"
        value={type}
        onChange={(value) => setType(value)} // Updated to directly use the value
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
      <Input
        placeholder="Assured Value"
        value={assured}
        onChange={(e) => setAssured(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> Fixed (Kbps)
      </Typography>
      <Input
        placeholder="Fixed Value"
        value={fixed}
        onChange={(e) => setFixed(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> Maximum (Kbps)
      </Typography>
      <Input
        placeholder="Maximum Value"
        value={maximum}
        onChange={(e) => setMaximum(e.target.value)}
      />
    </Modal>
  );
};

export default useUpdate;
