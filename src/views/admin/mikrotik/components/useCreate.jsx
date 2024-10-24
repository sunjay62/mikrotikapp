import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Select, Form, Modal, Space } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { useData } from "./useData";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const useCreate = ({ handleOpen, open }) => {
  const [name, setName] = useState("");
  const [apiPort, setApiPort] = useState(8728);
  const [ipAddress, setIpAddress] = useState("");
  const [password, setPassword] = useState("");
  const [siteId, setSiteId] = useState("");
  const [username, setUsername] = useState("");
  const { refetch } = useData();
  const [siteOptions, setSiteOptions] = useState([]);
  const [ipError, setIpError] = useState("");
  const [form] = Form.useForm();

  const resetForm = () => {
    form.resetFields();
    setName("");
    setIpAddress("");
    setPassword("");
    setSiteId("");
    setUsername("");
    setApiPort(8728);
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
        name: name,
        username: username,
        site_id: siteId,
        password: password,
        ipaddress: ipAddress,
        apiport: apiPort,
      };

      const response = await toast.promise(
        axios.post(`${BASE_URL}/mikrotik`, formData, config),
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

  // Function to validate IPv4 address
  const validateIPv4 = (ip) => {
    const ipv4Regex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
  };

  // Function to handle IP Address input change
  const handleIpAddressChange = (value) => {
    setIpAddress(value);
    if (!validateIPv4(value)) {
      setIpError("Invalid IPv4 address");
    } else {
      setIpError("");
    }
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Modal
      title="Create New Device"
      open={open}
      onCancel={() => {
        handleOpen();
        resetForm();
      }}
      footer={null}
      width={435}
    >
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        initialValues={{ apiport: 8728 }}
        onFinish={handleCreate}
        style={{
          width: "100%",
        }}
      >
        <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
          <span className="text-red-500">*</span> Device Name
        </Typography>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the Device Name!",
            },
          ]}
        >
          <Input
            placeholder="Device Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-96"
          />
        </Form.Item>
        <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
          <span className="text-red-500">*</span> IP Address
        </Typography>
        <Form.Item
          name="ipaddress"
          rules={[
            {
              required: true,
              message: "Please input the IP Address!",
            },
            {
              validator: (_, value) =>
                validateIPv4(value)
                  ? Promise.resolve()
                  : Promise.reject("Invalid IPv4 address"),
            },
          ]}
        >
          <Input
            placeholder="IP Address"
            value={ipAddress}
            onChange={(e) => handleIpAddressChange(e.target.value)}
            className="w-96"
          />
        </Form.Item>
        <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
          <span className="text-red-500">*</span> Username
        </Typography>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input the Username!",
            },
          ]}
        >
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-96"
          />
        </Form.Item>
        <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
          <span className="text-red-500">*</span> Password
        </Typography>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input the Password!",
            },
          ]}
        >
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-96"
          />
        </Form.Item>
        <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
          <span className="text-red-500">*</span> Site ID
        </Typography>
        <Form.Item
          name="siteId"
          className="w-96"
          rules={[
            {
              required: true,
              message: "Please select a Site ID!",
            },
          ]}
        >
          <Select
            placeholder="Site ID"
            onChange={(value) => setSiteId(value)}
            style={{ width: 384 }}
          >
            {siteOptions.map((option) => (
              <Option className="w-96" key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
          <span className="text-red-500">*</span> API Port
        </Typography>
        <Form.Item
          name="apiport"
          rules={[
            {
              required: true,
              message: "Please input the API Port!",
            },
          ]}
        >
          <Input
            type="number"
            placeholder="API Port"
            value={apiPort}
            onChange={(e) => setApiPort(e.target.value)}
            className="w-96"
          />
        </Form.Item>
        <Form.Item {...layout} className="flex justify-end">
          <Space>
            <Button className="bg-blue-500 text-white" htmlType="submit">
              Create
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default useCreate;
