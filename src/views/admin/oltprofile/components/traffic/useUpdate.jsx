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
  const [cbs, setCbs] = useState("");
  const [pbs, setPbs] = useState("");
  const [pir, setPir] = useState("");
  const [sir, setSir] = useState("");
  const { refetch } = useData();
  const [inputsNotEmpty, setInputsNotEmpty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (items) {
      setId(items.id || "");
      setName(items.name || "");
      setCbs(items.cbs || "");
      setSir(items.sir || "");
      setPir(items.pir || "");
      setPbs(items.pbs || "");
      setInputsNotEmpty(true);
    }
  }, [items]);

  const resetForm = () => {
    setCbs("");
    setName("");
    setPbs("");
    setPir("");
    setSir("");
    setInputsNotEmpty(true);
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
        sir,
        cbs,
        pbs,
        pir,
      };

      console.log(formData);

      const response = await toast.promise(
        axiosInstance.put(
          `${BASE_URL_OLT}/speedprofile/traffic`,
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

  useEffect(() => {
    // Check if all required fields are filled
    const allFieldsFilled = name && sir && cbs && pbs && pir;
    setInputsNotEmpty(allFieldsFilled);
  }, [name, sir, cbs, pbs, pir]);

  // useEffect(() => {
  //   const accessToken = localStorage.getItem("access_token");
  //   if (accessToken) {
  //     try {
  //       const decodedToken = jwtDecode(accessToken);
  //       setDecodedToken(decodedToken);
  //       console.log(decodedToken);
  //     } catch (error) {
  //       toast.error("Your session is expired, please login again.");
  //     }
  //   }
  // }, []);

  // const roleHidden =
  //   decodedToken.role === "teknisi" || decodedToken.role === "admin";

  return (
    <Modal
      title="Edit Traffic"
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
        placeholder="SIR (Kbps)"
        value={sir}
        onChange={(e) => setSir(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> CBS (Kbps)
      </Typography>
      <Input
        placeholder="CBS"
        value={cbs}
        onChange={(e) => setCbs(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> PBS (Kbps)
      </Typography>
      <Input
        placeholder="PBS"
        value={pbs}
        onChange={(e) => setPbs(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> PIR (Kbps)
      </Typography>
      <Input
        placeholder="PIR"
        value={pir}
        onChange={(e) => setPir(e.target.value)}
      />
    </Modal>
  );
};

export default useUpdate;
