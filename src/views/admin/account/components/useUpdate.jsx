import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Modal } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { useData } from "./useData";

const useUpdate = ({ handleOpenEdit, openEdit, selectedUsername }) => {
  const [password, setPassword] = useState("");
  const { refetch } = useData();
  const [inputsNotEmpty, setInputsNotEmpty] = useState(false);

  const resetForm = () => {
    setPassword("");
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
        username: selectedUsername,
        password: password,
      };

      const response = await toast.promise(
        axios.put(`${BASE_URL}/userlogin`, formData, config),
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
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!openEdit) {
      resetForm();
    }
  }, [openEdit]);

  useEffect(() => {
    setInputsNotEmpty(password !== "");
  }, [password]);

  return (
    <Modal
      title="Edit Account"
      open={openEdit}
      onCancel={handleOpenEdit}
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
        Username
      </Typography>
      <Input placeholder="Device Name" value={selectedUsername} disabled />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Password
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

export default useUpdate;
