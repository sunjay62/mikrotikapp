import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Select, Modal, message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { useData } from "./useData";

const useUpdate = ({ handleOpenEdit, openEdit, selectedMikrotikId }) => {
  const [name, setName] = useState("");
  const [apiPort, setApiPort] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [password, setPassword] = useState("");
  const [siteId, setSiteId] = useState("");
  const [siteOptions, setSiteOptions] = useState([]);
  const [username, setUsername] = useState("");
  const [siteLabel, setSiteLabel] = useState("");
  const [siteLabelId, setSiteLabelId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ipAddressError, setIpAddressError] = useState("");
  const { refetch } = useData();
  const { Option } = Select;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const responseData = await axios.get(
          `${BASE_URL}/mikrotik?mikrotik_id=${selectedMikrotikId}`,
          config
        );

        setApiPort(responseData.data.apiport);
        setIpAddress(responseData.data.ipaddress);
        setName(responseData.data.name);
        setPassword(responseData.data.password);
        setSiteId(responseData.data.site_id);
        setUsername(responseData.data.username);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [selectedMikrotikId]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        mikrotik_id: selectedMikrotikId,
        name: name,
        username: username,
        site_id: siteLabelId,
        password: password,
        ipaddress: ipAddress,
        apiport: apiPort,
      };

      const response = await axios.put(
        `${BASE_URL}/mikrotik`,
        formData,
        config
      );

      if (response.status === 200) {
        handleOpenEdit();
        refetch();
        message.success("Updated Successfully!");
      }
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const responseData = await axios.get(`${BASE_URL}/sites`, config);

        if (responseData && responseData.data) {
          setSiteOptions(
            responseData.data.map((site) => ({
              value: `${site.id}`,
              label: `${site.name} (${site.code})`,
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (Array.isArray(siteOptions) && siteOptions.length > 0) {
      const siteIdInt = parseInt(siteId);
      const matchedOption = siteOptions.find(
        (option) => parseInt(option.value) === siteIdInt
      );
      if (matchedOption) {
        setSiteLabel(matchedOption.label);
        setSiteLabelId(matchedOption.value);
      }
    }
  }, [siteId, siteOptions]);

  const handleChangeSite = (value) => {
    setSiteLabel(value);
    const selectedOption = siteOptions.find((option) => option.label === value);
    if (selectedOption) {
      setSiteId(selectedOption.value);
    }
  };

  // Handle IP Address change
  const handleIpAddressChange = (value) => {
    setIpAddress(value);
    setIpAddressError(validateIpAddress(value));
  };

  // validateIpAddress function
  const validateIpAddress = (value) => {
    const ipAddressPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipParts = value.split(".");
    if (
      ipParts.length !== 4 ||
      ipParts.some((part) => !ipAddressPattern.test(part))
    ) {
      return "Invalid IP Address";
    } else {
      return "";
    }
  };

  return (
    <Modal
      title="Edit MikroTik"
      open={openEdit}
      onCancel={handleOpenEdit}
      className="-mt-16"
      footer={[
        <Button
          key="confirm"
          className="bg-blue-500 text-white"
          onClick={handleUpdate}
        >
          Update
        </Button>,
      ]}
    >
      <div>
        <Typography.Text>Device Name</Typography.Text>
        <Input
          size="middle"
          placeholder="Device Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <Typography.Text>IP Address</Typography.Text>
        <Input
          size="middle"
          placeholder="IP Address"
          value={ipAddress}
          onChange={(e) => handleIpAddressChange(e.target.value)}
          error={!!ipAddressError}
        />
        {ipAddressError && (
          <Typography.Text type="danger">{ipAddressError}</Typography.Text>
        )}
      </div>
      <div>
        <Typography.Text>Username</Typography.Text>
        <Input
          size="middle"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <Typography.Text>Password</Typography.Text>
        <Input.Password
          size="middle"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          iconRender={(visible) =>
            visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
          }
        />
      </div>
      <div>
        <Typography.Text>Site ID</Typography.Text>
        <Select
          size="middle"
          className="w-full "
          value={siteLabel}
          onChange={handleChangeSite}
        >
          {siteOptions.map((option) => (
            <Option key={option.value} value={option.label}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        <Typography.Text>API Port</Typography.Text>
        <Input
          type="number"
          size="middle"
          placeholder="API Port"
          value={apiPort}
          onChange={(e) => setApiPort(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default useUpdate;
