import React, { useState, useEffect } from "react";
import { Button, Input, Form, Typography, Select, Modal, Space } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { useData } from "./useData";
import { toast } from "react-toastify";

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
  const [password, setPassword] = useState("");
  const [mikrotikId, setMikrotikId] = useState("");
  const [profile, setProfile] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [comment, setComment] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { refetch } = useData();
  const [mikrotikOptions, setMikrotikOptions] = useState([]);
  const [profileOptions, setProfileOptions] = useState([]);
  const [form] = Form.useForm();

  const resetForm = () => {
    form.resetFields();
    setName("");
    setPassword("");
    setProfile("");
    setService("");
    setStatus("");
    setComment("");
    setMikrotikId("");
    setConfiguration("");
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
        comment: comment,
        mikrotik_id: mikrotikId,
        name: name,
        password: password,
        profile: profile,
        service_type: service,
        status: status,
        configuration: configuration,
      };

      const response = await toast.promise(
        axios.post(`${BASE_URL}/clientppp`, formData, config),
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
      console.log(error);
      toast.error("Failed to create.");
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

        const responseData = await axios.get(`${BASE_URL}/mikrotik`, config);

        if (responseData && responseData.data) {
          setMikrotikOptions(
            responseData.data.map((site) => ({
              value: `${site.mikrotik_id}`,
              label: `${site.name}`,
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
    if (mikrotikId) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("access_token");
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const responseData = await axios.get(
            `${BASE_URL}/mikrotik/${mikrotikId}/pppprofile`,
            config
          );

          if (responseData && responseData.data) {
            setProfileOptions(
              responseData.data.data.map((site) => ({
                value: `${site.name}`,
                label: `${site.name}`,
              }))
            );
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    } else {
      setProfileOptions([]);
    }
  }, [mikrotikId]);

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
  };

  const filteredMikrotikOptions = mikrotikOptions.filter((option) =>
    option.label.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <Modal
      open={open}
      onCancel={() => {
        handleOpen();
        resetForm();
      }}
      width={430}
      footer={null}
      className="-mt-16"
      title="Create New Secret"
    >
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={handleCreate}
        style={{
          width: "100%",
        }}
      >
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          Name
        </Typography>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name!",
            },
          ]}
          className="w-96"
        >
          <Input
            size="middle"
            color="blue"
            className="w-96"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          Password
        </Typography>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input the password!",
            },
          ]}
          className="w-96"
        >
          <Input.Password
            size="middle"
            color="blue"
            className="w-96"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          MikroTik
        </Typography>
        <Form.Item
          name="mikrotik"
          rules={[
            {
              required: true,
              message: "Please select a MikroTik!",
            },
          ]}
          className="w-96"
        >
          <Select
            size="middle"
            className="w-96"
            color="blue"
            onChange={(value) => setMikrotikId(value)}
            value={mikrotikId}
            showSearch
            placeholder="Select MikroTik"
            optionFilterProp="children"
            onSearch={handleSearchInputChange}
          >
            {filteredMikrotikOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {mikrotikId && (
          <>
            <Typography
              variant="paragraph"
              color="blue-gray"
              className="mb-1 mt-1 text-sm"
            >
              Profile
            </Typography>
            <Form.Item
              name="profile"
              rules={[
                {
                  required: true,
                  message: "Please select a profile!",
                },
              ]}
              className="w-96"
            >
              <Select
                size="middle"
                className="w-96"
                color="blue"
                placeholder="Select Profile"
                onChange={(value) => setProfile(value)}
                value={profile}
              >
                {profileOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          Service Type
        </Typography>
        <Form.Item
          name="service"
          rules={[
            {
              required: true,
              message: "Please select a service type!",
            },
          ]}
          className="w-96"
        >
          <Select
            size="middle"
            className="w-96"
            color="blue"
            placeholder="Select Service Type"
            onChange={(value) => setService(value)}
            value={service}
          >
            <Option value="any">Any</Option>
            <Option value="async">Async</Option>
            <Option value="l2tp">L2TP</Option>
            <Option value="ovpn">OVPN</Option>
            <Option value="pppoe">PPPOE</Option>
            <Option value="pptp">PPTP</Option>
            <Option value="sstp">SSTP</Option>
          </Select>
        </Form.Item>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          Status
        </Typography>
        <Form.Item
          name="status"
          rules={[
            {
              required: true,
              message: "Please select a status!",
            },
          ]}
          className="w-96"
        >
          <Select
            size="middle"
            className="w-96"
            color="blue"
            placeholder="Select Status"
            onChange={(value) => setStatus(value)}
            value={status}
          >
            <Option value="enable">Enable</Option>
            <Option value="disable">Disable</Option>
          </Select>
        </Form.Item>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          Configuration
        </Typography>
        <Form.Item
          name="configuration"
          rules={[
            {
              required: true,
              message: "Please select a configuration!",
            },
          ]}
          className="w-96"
        >
          <Select
            size="middle"
            className="w-96"
            color="blue"
            placeholder="Select Configuration"
            onChange={(value) => setConfiguration(value)}
            value={configuration}
          >
            <Option value="configured">Configured</Option>
            <Option value="unconfigured">Unconfigured</Option>
          </Select>
        </Form.Item>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-1 text-sm"
        >
          Comment
        </Typography>
        <Form.Item name="comment" className="w-96">
          <Input
            size="middle"
            color="blue"
            className="w-96"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Form.Item>
        <Form.Item {...layout} className="w-96">
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
