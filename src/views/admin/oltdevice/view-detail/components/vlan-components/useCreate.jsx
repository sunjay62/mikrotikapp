import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Modal } from "antd";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useData } from "./useData";
import { BASE_URL_OLT } from "libs/auth-api";
import axiosInstance from "utils/axiosInstance";

const useCreate = ({ handleOpen, open }) => {
  const { deviceId } = useParams();
  const [name, setName] = useState("");
  const [vlanId, setVlanId] = useState("");
  const [description, setDescription] = useState("");
  const { refetch } = useData();
  const [inputsNotEmpty, setInputsNotEmpty] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setVlanId("");
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
        description,
        device_id: deviceId,
        name,
        vlan_id: vlanId,
      };

      console.log(formData);

      const response = await toast.promise(
        axiosInstance.post(
          `${BASE_URL_OLT}/devices/vlan/action`,
          formData,
          config
        ),
        {
          pending: "Creating ...",
          success: "Created Successfully!",
        }
      );

      if (response.status === 200) {
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
    setInputsNotEmpty(name !== "" && vlanId !== "");
  }, [name, vlanId]);

  return (
    <Modal
      title="Create New Vlan"
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
        <span className="text-red-500">*</span> Name Vlan
      </Typography>
      <Input
        placeholder="Vlan Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> Vlan ID
      </Typography>
      <div style={{ position: "relative" }}>
        <Input
          type="number"
          placeholder="Vlan ID"
          value={vlanId}
          onChange={(e) => setVlanId(e.target.value)}
        />
      </div>
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        Description
      </Typography>
      <div style={{ position: "relative" }}>
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default useCreate;
