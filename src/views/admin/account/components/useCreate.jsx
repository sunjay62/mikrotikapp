import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Modal, Checkbox, Select } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { useData } from "./useData";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const useCreate = ({ handleOpen, open }) => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [siteAccessOptions, setSiteAccessOptions] = useState([]);
  const { refetch } = useData();
  const [inputsNotEmpty, setInputsNotEmpty] = useState(false);
  const [selectedSites, setSelectedSites] = useState([]);
  const navigate = useNavigate();

  const resetForm = () => {
    setPassword("");
    setUsername("");
    setRole(""); // Reset role
    setSelectedSites([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          throw new Error("Access token is missing.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const responseData = await axios.get(`${BASE_URL}/sites`, config);

        console.log(responseData.data);
        setSiteAccessOptions(
          responseData.data.map((site) => ({
            value: site.id,
            label: `${site.name} ${site.code}`,
          }))
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (error.response.status === 401) {
              try {
                const refreshToken = localStorage.getItem("refresh_token");

                const refreshResponse = await axios.post(
                  `${BASE_URL}/userlogin/@refresh_token`,
                  {
                    refresh_token: refreshToken,
                  }
                );

                if (refreshResponse.data && refreshResponse.data.access_token) {
                  localStorage.setItem(
                    "access_token",
                    refreshResponse.data.access_token
                  );
                  refetch();
                }
              } catch (refreshError) {
                if (axios.isAxiosError(refreshError)) {
                  if (
                    refreshError.response &&
                    [401, 422].includes(refreshError.response.status)
                  ) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    navigate("/login");
                    toast.error(
                      "Your session has expired, please login again."
                    );
                  }
                }
              }
            }
          }
        }
      }
    };

    fetchData();
  }, [refetch, navigate]);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        username,
        password,
        role,
        list_site: selectedSites,
      };

      console.log(formData);

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
    setInputsNotEmpty(username !== "" && password !== "" && role !== "");
  }, [username, password, role]);

  const handleSelectSites = (checkedValues) => {
    setSelectedSites(checkedValues);
  };

  return (
    <Modal
      title="Create New Account"
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
        <span className="text-red-500">*</span> Username
      </Typography>
      <Input
        placeholder="Device Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> Password
      </Typography>
      <div style={{ position: "relative" }}>
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> Select Role
      </Typography>
      <Select
        placeholder="Select Role"
        value={role}
        className="w-full"
        onChange={(value) => setRole(value)} // Correctly set the role value
      >
        <Option value="superadmin">Super Admin</Option>
        <Option value="admin">Admin</Option>
        <Option value="teknisi">Teknisi</Option>
      </Select>

      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        <span className="text-red-500">*</span> Select Site Access
      </Typography>

      <Checkbox.Group />
      <Select
        mode="multiple"
        allowClear
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        options={siteAccessOptions}
        value={selectedSites}
        onChange={handleSelectSites}
        className="w-full"
      />
    </Modal>
  );
};

export default useCreate;
