import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Modal } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { useData } from "./useData";

const useCreate = ({ handleOpen, open }) => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { refetch } = useData();
  const [inputsNotEmpty, setInputsNotEmpty] = useState(false);

  const resetForm = () => {
    setPassword("");
    setUsername("");
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
        username: username,
        password: password,
      };

      const response = await toast.promise(
        axios.post(`${BASE_URL}/userlogin`, formData, config),
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
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  useEffect(() => {
    setInputsNotEmpty(username !== "" && password !== "");
  }, [username, password]);

  return (
    <Modal
      title="Create New Account"
      open={open}
      onCancel={handleOpen}
      footer={[
        <Button
          key="confirm"
          className="bg-blue-500 text-white"
          onClick={handleCreate}
          disabled={!inputsNotEmpty}
        >
          Confirm
        </Button>,
      ]}
    >
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        <span className="text-red-500">*</span> Username
      </Typography>
      <Input
        placeholder="Device Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        <span className="text-red-500">*</span> Password
      </Typography>
      <div style={{ position: "relative" }}>
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default useCreate;
