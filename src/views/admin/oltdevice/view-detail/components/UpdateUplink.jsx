import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Modal } from "antd";
import { toast } from "react-toastify";
import { BASE_URL_OLT } from "libs/auth-api";
import { useData } from "./useData";
import { useNavigate } from "react-router-dom";
import axiosInstance from "utils/axiosInstance";

const UpdateUplink = ({ handleOpenEdit, openEdit, items, onRefetch }) => {
  const [decodedToken, setDecodedToken] = useState({});
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [taggedVlans, setTaggedVlans] = useState("");
  const [mode, setMode] = useState("");
  const [addVlans, setAddVlans] = useState("");
  const [removeVlans, setRemoveVlans] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { refetch } = useData();
  const [inputsNotEmpty, setInputsNotEmpty] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (items) {
      console.log(items);
      setId(items.id || "");
      setName(items.name || "");
      setMode(items.mode || "");
      setDescription(items.description || "");
      setTaggedVlans(items.vlan_tag || "");

      setInputsNotEmpty(true);
    }
  }, [items]);

  useEffect(() => {
    const hasValidInput = addVlans.trim() !== "" || removeVlans.trim() !== "";
    setInputsNotEmpty(hasValidInput);
  }, [addVlans, removeVlans]);

  const validateVlanInput = (input) => {
    if (!input) return true; // Skip validation if field is empty

    // First check: only allow numbers, commas, and dashes
    const validCharPattern = /^[0-9,\-]*$/;
    if (!validCharPattern.test(input)) {
      setErrorMessage(
        "The VLANs field can contain only numbers, comma (,) and the dash (-) character"
      );
      return false;
    }

    // Second check: must contain at least one number
    const hasNumberPattern = /[0-9]/;
    if (!hasNumberPattern.test(input)) {
      setErrorMessage("The VLANs field must contain at least one number");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setName("");
    setAddVlans("");
    setRemoveVlans("");
    setInputsNotEmpty(false);
  };

  const handleUpdate = async () => {
    try {
      // Validate inputs first
      if (addVlans && !validateVlanInput(addVlans)) {
        setErrorModalVisible(true);
        return;
      }
      if (removeVlans && !validateVlanInput(removeVlans)) {
        setErrorModalVisible(true);
        return;
      }

      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (!addVlans && !removeVlans) {
        toast.error("Please fill either Add Vlans or Remove Vlans");
        return;
      }

      // Case 1: Only Add Vlans is filled
      if (addVlans && !removeVlans) {
        const formData = {
          id_uplink: id,
          vlan_tag: addVlans,
        };

        const responseAdd = await toast.promise(
          axiosInstance.post(
            `${BASE_URL_OLT}/devices/card/uplink/vlan_tag`,
            formData,
            config
          ),
          {
            pending: "Adding VLANs...",
            success: "VLANs Added Successfully!",
          }
        );

        if (responseAdd.status === 200) {
          resetForm();
          handleOpenEdit();
          await onRefetch();
        }
      }
      // Case 2: Only Remove Vlans is filled
      else if (!addVlans && removeVlans) {
        const formData = {
          id_uplink: id,
          vlan_tag: removeVlans,
        };

        const responseDelete = await toast.promise(
          axiosInstance.delete(`${BASE_URL_OLT}/devices/card/uplink/vlan_tag`, {
            data: formData,
            ...config,
          }),
          {
            pending: "Removing VLANs...",
            success: "VLANs Removed Successfully!",
          }
        );

        if (responseDelete.status === 200) {
          resetForm();
          handleOpenEdit();
          await onRefetch();
        }
      }
      // Case 3: Both Add and Remove Vlans are filled
      else {
        const addFormData = {
          id_uplink: id,
          vlan_tag: addVlans,
        };

        const responseAdd = await toast.promise(
          axiosInstance.post(
            `${BASE_URL_OLT}/devices/card/uplink/vlan_tag`,
            addFormData,
            config
          ),
          {
            pending: "Adding VLANs...",
            success: "VLANs Added Successfully!",
          }
        );

        if (responseAdd.status === 200) {
          const removeFormData = {
            id_uplink: id,
            vlan_tag: removeVlans,
          };

          const responseDelete = await toast.promise(
            axiosInstance.delete(
              `${BASE_URL_OLT}/devices/card/uplink/vlan_tag`,
              { data: removeFormData, ...config }
            ),
            {
              pending: "Removing VLANs...",
              success: "VLANs Updated Successfully!",
            }
          );

          if (responseDelete.status === 200) {
            resetForm();
            handleOpenEdit();
            await onRefetch();
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
      console.log(error);
    }
  };

  useEffect(() => {
    if (!openEdit) {
      resetForm();
    }
  }, [openEdit]);

  return (
    <>
      <Modal
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
        <div className="mb-2 flex border-b-2 border-gray-800 pb-4 text-xl font-bold">
          <h1>Configure Uplink Port - {name}</h1>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <h1>Mode</h1>
          <Input className="w-96" value={mode} disabled />
        </div>
        <div className="mb-2 flex items-center justify-between">
          <h1>Tagged Vlans</h1>
          <Input className="w-96" value={taggedVlans} disabled />
        </div>
        <div className="mb-2 flex items-center justify-between">
          <h1>Description</h1>
          <Input className="w-96" value={description} disabled />
        </div>

        <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
          Add Vlans
        </Typography>
        <Input
          placeholder="Add Vlans"
          value={addVlans}
          onChange={(e) => setAddVlans(e.target.value)}
        />
        <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
          Remove Vlans
        </Typography>
        <Input
          placeholder="Remove Vlans"
          value={removeVlans}
          onChange={(e) => setRemoveVlans(e.target.value)}
        />
      </Modal>

      {/* Error Modal */}
      <Modal
        title="Invalid Input"
        open={errorModalVisible}
        onOk={() => setErrorModalVisible(false)}
        onCancel={() => setErrorModalVisible(false)}
        footer={[
          <Button
            key="ok"
            className="bg-blue-500 text-white"
            onClick={() => setErrorModalVisible(false)}
          >
            OK
          </Button>,
        ]}
      >
        <p>{errorMessage}</p>
      </Modal>
    </>
  );
};

export default UpdateUplink;
