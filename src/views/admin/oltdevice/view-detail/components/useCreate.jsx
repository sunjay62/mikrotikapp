import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, Input, Select, Modal, Row, Col } from "antd";
import moment from "moment";
import { useData } from "./useData";
import { BASE_URL_OLT } from "libs/auth-api";
import axiosInstance from "utils/axiosInstance";
import { BASE_URL } from "libs/auth-api";

const { Option } = Select;

const useCreate = ({ handleOpen, open }) => {
  const [form] = Form.useForm();
  const { refetch } = useData();
  const [name, setName] = useState("");
  const [host, setHost] = useState("");
  const [telnetPass, setTelnetPass] = useState("");
  const [telnetUser, setTelnetUser] = useState("");
  const [snmpRo, setSnmpRo] = useState("");
  const [snmpWr, setSnmpWr] = useState("");
  const [selectedMerk, setSelectedMerk] = useState([]);
  const [masterMerkOptions, setMasterMerkOptions] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const [idSoftware, setIdSoftware] = useState("");
  const [snmpPort, setSnmpPort] = useState("");
  const [telnetPort, setTelnetPort] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [siteId, setSiteId] = useState("");
  const [siteOptions, setSiteOptions] = useState([]);

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

        const responseData = await axiosInstance.get(
          `${BASE_URL_OLT}/oltmaster/merk`,
          config
        );

        setMasterMerkOptions(
          responseData.data.map((site) => ({
            value: site.id,
            label: `${site.merk} - ${site.model}`,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [refetch]);

  useEffect(() => {
    if (selectedMerk) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("access_token");
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const formData = {
            id: parseInt(selectedMerk),
          };

          const responseData = await axiosInstance.post(
            `${BASE_URL_OLT}/oltmaster/merk/software`,
            formData,
            config
          );

          console.log(responseData);

          if (responseData && responseData.data) {
            setSoftwareOptions(
              responseData.data.map((site) => ({
                value: `${site.id}`,
                label: `${site.name}`,
              }))
            );
          }

          if (responseData.status === 200) {
            setIdSoftware("");
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [selectedMerk]);

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
  };

  const filteredSoftwareOptions = softwareOptions.filter((option) =>
    option.label.toLowerCase().includes(searchInput.toLowerCase())
  );

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
        host: host,
        telnet_pass: telnetPass,
        telnet_user: telnetUser,
        snmp_ro_com: snmpRo,
        snmp_wr_com: snmpWr,
        id_site: parseInt(siteId) || 0,
        id_merk: selectedMerk || 0,
        id_software: parseInt(idSoftware || 0),
        snmp_port: parseInt(snmpPort || 0),
        telnet_port: parseInt(telnetPort || 0),
      };

      console.log(formData);

      const response = await toast.promise(
        axiosInstance.post(`${BASE_URL_OLT}/devices`, formData, config),
        {
          pending: "Creating ...",
          success: "Created Successfully!",
        }
      );

      if (response.status === 201) {
        handleCancel();
        refetch();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.log(error);
    }
  };

  const commonStyle = {
    width: "100%",
  };

  const handleCancel = () => {
    form.resetFields();
    setName("");
    handleOpen();
  };

  const handleSelectMaster = (checkedValues) => {
    setSelectedMerk(checkedValues);
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

        const responseData = await axiosInstance.get(
          `${BASE_URL}/sites`,
          config
        );

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

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      className="mt-[-50px]"
      width={850}
      footer={null}
    >
      <div className="flex justify-between pr-7">
        <h1 className="text-2xl font-bold">Create New Device</h1>
      </div>
      <Form
        form={form}
        name="control-hooks-create"
        style={{
          maxWidth: 800,
        }}
        className="mt-10"
        onFinish={handleCreate}
      >
        <Row gutter={16}>
          <Col span={24}>
            <p className="mb-1">Device Name</p>
            <Form.Item name="name">
              <Input
                style={commonStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1">Select Site Location</p>
            <Form.Item name="site">
              <Select
                onChange={(value) => setSiteId(value)}
                showSearch
                optionFilterProp="children"
              >
                {siteOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <p className="mb-1">Select Merk</p>
            <Form.Item name="merk">
              <Select
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                options={masterMerkOptions}
                value={selectedMerk}
                onChange={handleSelectMaster}
                className="w-full"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1">Select Software</p>
            <Form.Item name="software">
              <Select
                className="w-full"
                allowClear
                onChange={(value) => setIdSoftware(value)}
                value={idSoftware}
                showSearch
                optionFilterProp="children"
                onSearch={handleSearchInputChange}
              >
                {filteredSoftwareOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1"> Telnet User</p>
            <Form.Item name="telnetuser">
              <Input
                style={commonStyle}
                value={telnetUser}
                onChange={(e) => setTelnetUser(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1"> Telnet Password</p>
            <Form.Item name="telnetpass">
              <Input
                style={commonStyle}
                value={telnetPass}
                onChange={(e) => setTelnetPass(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1"> Telnet Port</p>
            <Form.Item name="telnetport">
              <Input
                style={commonStyle}
                value={telnetPort}
                onChange={(e) => setTelnetPort(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1"> IP Host</p>
            <Form.Item name="host">
              <Input
                style={commonStyle}
                value={host}
                onChange={(e) => setHost(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <p className="mb-1"> SNMP Port</p>
            <Form.Item name="snmpport">
              <Input
                style={commonStyle}
                value={snmpPort}
                onChange={(e) => setSnmpPort(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <p className="mb-1">SNMP Read Only</p>
            <Form.Item name="snmpro">
              <Input
                style={commonStyle}
                value={snmpRo}
                onChange={(e) => setSnmpRo(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <p className="mb-1">SNMP Write</p>
            <Form.Item name="snmpwr">
              <Input
                style={commonStyle}
                value={snmpWr}
                onChange={(e) => setSnmpWr(e.target.value)}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <div className="flex items-end justify-end">
              <Button className="bg-blue-500 text-white" htmlType="submit">
                Create
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default useCreate;
