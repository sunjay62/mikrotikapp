import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Button, Form, Input, Select, Modal, Row, Col } from "antd";
import moment from "moment";
import { useData } from "./useData";
import { BASE_URL_OLT } from "libs/auth-api";
import axiosInstance from "utils/axiosInstance";

const { Option } = Select;

const useUpdate = ({ handleOpenEdit, openEdit, items }) => {
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
  const [idSoftware, setIdSoftware] = useState("");
  const [snmpPort, setSnmpPort] = useState("");
  const [telnetPort, setTelnetPort] = useState("");
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [id, setId] = useState("");
  const [selectedSoftwareName, setSelectedSoftwareName] = useState("");

  useEffect(() => {
    if (items) {
      setId(items.id || "");
      setName(items.name || "");
      setHost(items.host || "");
      setTelnetPass(items.telnet_pass || "");
      setTelnetUser(items.telnet_user || "");
      setSnmpRo(items.snmp_ro_com || "");
      setSnmpWr(items.snmp_wr_com || "");
      setSelectedMerk(items.id_merk || "");
      setIdSoftware(items.id_software || "");
      setSnmpPort(items.snmp_port || "");
      setTelnetPort(items.telnet_port || "");

      console.log(items);
    }
  }, [items]);

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

        console.log(responseData.data);
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

            // Set the name of the selected software if idSoftware matches
            const selectedSoftware = responseData.data.find(
              (software) => software.id === idSoftware
            );
            if (selectedSoftware) {
              setSelectedSoftwareName(selectedSoftware.name);
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }
  }, [selectedMerk, idSoftware]);

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
  };

  const filteredSoftwareOptions = softwareOptions.filter((option) =>
    option.label.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        id: id,
        name: name,
        host: host,
        telnet_pass: telnetPass,
        telnet_user: telnetUser,
        snmp_ro_com: snmpRo,
        snmp_wr_com: snmpWr,
        id_merk: selectedMerk || 0,
        id_software: parseInt(idSoftware || 0),
        snmp_port: parseInt(snmpPort || 0),
        telnet_port: parseInt(telnetPort || 0),
      };

      console.log(formData);

      const response = await toast.promise(
        axiosInstance.put(`${BASE_URL_OLT}/devices`, formData, config),
        {
          pending: "Updating ...",
          success: "Updated Successfully!",
        }
      );

      if (response.status === 200) {
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
    handleOpenEdit();
  };

  const handleSelectMaster = (checkedValues) => {
    setSelectedMerk(checkedValues);
  };

  return (
    <Modal open={openEdit} onCancel={handleCancel} width={850} footer={null}>
      <div className="mb-3 flex justify-between pr-7">
        <h1 className="text-2xl font-bold">Edit Onu Type</h1>
      </div>
      <Form
        form={form}
        name="control-hooks-create"
        style={{
          maxWidth: 800,
        }}
        onFinish={handleUpdate}
      >
        <Row gutter={16}>
          <Col span={12}>
            <p className="mb-1 mt-3">Device Name</p>
            <Input
              style={commonStyle}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3">Merk</p>
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
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3">Software</p>
            <Select
              className="w-full"
              allowClear
              value={selectedSoftwareName}
              onChange={(value) => {
                setIdSoftware(value);
                const selectedSoftware = softwareOptions.find(
                  (option) => option.value === value
                );
                if (selectedSoftware) {
                  setIdSoftware(selectedSoftware.value);
                  setSelectedSoftwareName(selectedSoftware.label);
                }
              }}
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
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3"> Telnet User</p>
            <Input
              style={commonStyle}
              value={telnetUser}
              onChange={(e) => setTelnetUser(e.target.value)}
            />
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3"> Telnet Password</p>
            <Input
              style={commonStyle}
              value={telnetPass}
              onChange={(e) => setTelnetPass(e.target.value)}
            />
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3"> Telnet Port</p>
            <Input
              style={commonStyle}
              value={telnetPort}
              onChange={(e) => setTelnetPort(e.target.value)}
            />
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3"> IP Host</p>
            <Input
              style={commonStyle}
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
          </Col>
          <Col span={12}>
            <p className="mb-1 mt-3"> SNMP Port</p>
            <Input
              style={commonStyle}
              value={snmpPort}
              onChange={(e) => setSnmpPort(e.target.value)}
            />
          </Col>

          <Col span={12}>
            <p className="mb-1 mt-3">SNMP Read Only</p>
            <Input
              style={commonStyle}
              value={snmpRo}
              onChange={(e) => setSnmpRo(e.target.value)}
            />
          </Col>
          <Col span={12}>
            <p className="mb-1 mt-3">SNMP Write </p>
            <Input
              style={commonStyle}
              value={snmpWr}
              onChange={(e) => setSnmpWr(e.target.value)}
            />
          </Col>

          <Col span={24}>
            <div className="mt-3 flex items-end justify-end">
              <Button className="bg-blue-500 text-white" htmlType="submit">
                Submit
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default useUpdate;
