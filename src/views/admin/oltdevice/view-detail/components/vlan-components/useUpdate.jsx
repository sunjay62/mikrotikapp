import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Modal } from "antd";
import { toast } from "react-toastify";
import { useData } from "./useData";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "utils/axiosInstance";
import { BASE_URL_OLT } from "libs/auth-api";

const useUpdate = ({ handleOpenEdit, openEdit, dataVlan }) => {
  const { refetch } = useData();
  const [inputsNotEmpty, setInputsNotEmpty] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [decodedToken, setDecodedToken] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (dataVlan) {
      setId(dataVlan.id || "");
      setName(dataVlan.name || "");
      setDescription(dataVlan.description || "");
      console.log(dataVlan);
    }
  }, [dataVlan]);

  const resetForm = () => {
    setDescription("");
    setName("");
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Create the formData object
      const formData = {
        id,
        name,
        description,
      };

      console.log(formData);

      const response = await toast.promise(
        axiosInstance.put(
          `${BASE_URL_OLT}/devices/vlan/action`,
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
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    // Reset form when the modal is closed
    if (!openEdit) {
      resetForm();
    }
  }, [openEdit]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        setDecodedToken(decodedToken);
        console.log(decodedToken);
      } catch (error) {
        toast.error("Your session is expired, please login again.");
      }
    }
  }, []);

  useEffect(() => {
    setInputsNotEmpty(name !== "");
  }, [name]);

  const roleHidden =
    decodedToken.role === "teknisi" || decodedToken.role === "admin";

  return (
    <Modal
      title="Edit Vlan"
      open={openEdit}
      onCancel={handleOpenEdit}
      afterClose={resetForm} // Ensure form is reset after modal closes
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
        <span className="text-red-500">*</span> Name Vlan
      </Typography>
      <Input
        placeholder="Vlan Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

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

export default useUpdate;
