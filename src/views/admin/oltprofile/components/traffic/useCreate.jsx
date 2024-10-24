import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Typography,
  Modal,
  InputNumber,
  Checkbox,
  Select,
} from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL_OLT } from "libs/auth-api";
import { useData } from "./useData";
import { useNavigate } from "react-router-dom";
import axiosInstance from "utils/axiosInstance";
const { Option } = Select;

const useCreate = ({ handleOpen, open }) => {
  const [name, setName] = useState("");
  const [cbs, setCbs] = useState("");
  const [pbs, setPbs] = useState("");
  const [pir, setPir] = useState("");
  const [sir, setSir] = useState("");
  const { refetch } = useData();
  const [inputsNotEmpty, setInputsNotEmpty] = useState(false);

  const resetForm = () => {
    setCbs("");
    setName("");
    setPbs("");
    setPir("");
    setSir("");
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
        sir,
        cbs,
        pbs,
        pir,
      };

      console.log(formData);

      const response = await toast.promise(
        axiosInstance.post(
          `${BASE_URL_OLT}/speedprofile/traffic`,
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
      name !== "" && sir !== "" && cbs !== "" && pbs !== "" && pir !== ""
    );
  }, [name, sir, cbs, pbs, pir]);

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
        <span className="text-red-500">*</span> SIR (Kbps)
      </Typography>
      <Input
        className="w-full"
        placeholder="SIR (Kbps)"
        value={sir}
        onChange={(e) => setSir(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> CBS (Kbps)
      </Typography>
      <Input
        className="w-full"
        placeholder="CBS"
        value={cbs}
        onChange={(e) => setCbs(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> PBS (Kbps)
      </Typography>
      <Input
        className="w-full"
        placeholder="PBS"
        value={pbs}
        onChange={(e) => setPbs(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> PIR (Kbps)
      </Typography>
      <Input
        className="w-full"
        placeholder="PIR"
        value={pir}
        onChange={(e) => setPir(e.target.value)}
      />
    </Modal>
  );
};

export default useCreate;
