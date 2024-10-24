import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Select, Modal } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { useData } from "./useData";

const { Option } = Select;

const useUpdate = ({ handleOpenEdit, openEdit, selectedClientId }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [mikrotikId, setMikrotikId] = useState("");
  const [profile, setProfile] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [comment, setComment] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { refetch } = useData();
  const [mikrotikOptions, setMikrotikOptions] = useState([]);
  const [profileOptions, setProfileOptions] = useState([]);
  const [profileLabel, setProfileLabel] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [siteOptions, setSiteOptions] = useState([]);
  const [siteId, setSiteId] = useState("");
  const [siteLabel, setSiteLabel] = useState("");
  const [selectedMikrotikName, setSelectedMikrotikName] = useState("");
  const { TextArea } = Input;

  const resetFields = () => {
    setName("");
    setPassword("");
    setMikrotikId("");
    setProfile("");
    setService("");
    setStatus("");
    setConfiguration("");
    setComment("");
    setSiteId("");
    setSiteLabel("");
    setSelectedMikrotikName("");
  };

  useEffect(() => {
    if (profile && !profileLabel) {
      setProfileLabel(profile);
    }
  }, [profile, profileLabel]);

  // Fetch client data
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const responseData = await axios.get(
          `${BASE_URL}/clientppp?client_id=${selectedClientId}`,
          config
        );

        setName(responseData.data.name);
        setPassword(responseData.data.password);
        setService(responseData.data.service_type);
        setProfile(responseData.data.profile);
        setMikrotikId(responseData.data.mikrotik_id);
        setStatus(responseData.data.status);
        setConfiguration(responseData.data.configuration);
        setComment(responseData.data.comment);
        setSiteId(responseData.data.site_id);
        setProfileLabel(responseData.data.profile);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClientData();
  }, [selectedClientId]);

  // Fetch sites data
  useEffect(() => {
    const fetchSitesData = async () => {
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

          // If siteId is not set, show all sites in the dropdown
          if (!siteId) {
            setSiteLabel("Select Site Location");
          } else {
            // Find the label for the initial site ID
            const initialSite = responseData.data.find(
              (site) => site.id === siteId
            );
            if (initialSite) {
              setSiteLabel(`${initialSite.name} (${initialSite.code})`);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSitesData();
  }, [siteId]);

  // Fetch MikroTik options based on siteId
  const fetchMikrotikOptions = async (siteId) => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        id: parseInt(siteId),
      };

      const responseData = await axios.post(
        `${BASE_URL}/sites/mikrotik`,
        formData,
        config
      );

      if (responseData && responseData.data) {
        setMikrotikOptions(
          responseData.data.map((site) => ({
            value: `${site.mikrotik_id}`,
            label: `${site.name}`,
          }))
        );
      }

      if (responseData && responseData.data) {
        const selectedMikrotik = responseData.data.find(
          (mikrotik) => mikrotik.mikrotik_id === mikrotikId
        );
        if (selectedMikrotik) {
          setSelectedMikrotikName(selectedMikrotik.name);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (siteId) {
      fetchMikrotikOptions(siteId);
    }
  }, [siteId]);

  useEffect(() => {
    const fetchData = async () => {
      if (mikrotikId) {
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
      } else {
        setProfileOptions([]);
      }
    };

    fetchData();
  }, [mikrotikId]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        client_id: selectedClientId,
        name: name,
        password: password,
        comment: comment,
        mikrotik_id: parseInt(mikrotikId),
        profile: profile,
        service_type: service,
        status: status,
        configuration: configuration,
      };

      console.log(formData);

      const response = await toast.promise(
        axios.put(`${BASE_URL}/clientppp`, formData, config),
        {
          pending: "Updating ...",
          success: "Updated Successfully!",
        }
      );

      if (response.status === 200) {
        handleOpenEdit();
        resetFields();
        refetch();
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const handleChangeSite = (value) => {
    const selectedOption = siteOptions.find((option) => option.value === value);
    if (selectedOption) {
      setSiteId(selectedOption.value);
      setSiteLabel(selectedOption.label);
      fetchMikrotikOptions(selectedOption.value); // Fetch MikroTik options based on selected site
    }
  };

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
  };

  const filteredMikrotikOptions = mikrotikOptions.filter((option) =>
    option.label.toLowerCase().includes(searchInput.toLowerCase())
  );

  const filteredProfileOptions = profileOptions.filter((option) =>
    option.label.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <Modal
      title="Edit Secret"
      open={openEdit}
      onCancel={() => {
        handleOpenEdit();
        resetFields();
      }}
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
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Name
      </Typography>
      <Input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Password
      </Typography>
      <div style={{ position: "relative" }}>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
          }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOutlined style={{ fontSize: "16px" }} />
          ) : (
            <EyeInvisibleOutlined style={{ fontSize: "16px" }} />
          )}
        </button>
      </div>
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Site Location
      </Typography>
      <Select
        placeholder="Select Site Location"
        value={siteLabel}
        onChange={handleChangeSite}
        className="w-full"
        showSearch
        optionFilterProp="children"
      >
        {siteOptions.map((option) => (
          <Option className="w-96" key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
      {siteId && (
        <>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="mb-1 mt-2"
          >
            MikroTik
          </Typography>
          <Select
            placeholder="MikroTik"
            value={selectedMikrotikName}
            onChange={(value) => {
              const selectedMikrotik = mikrotikOptions.find(
                (option) => option.label === value
              );
              if (selectedMikrotik) {
                setMikrotikId(selectedMikrotik.value);
                setSelectedMikrotikName(selectedMikrotik.label);
              }
            }}
            className="w-full"
            showSearch
            onSearch={handleSearchInputChange}
            filterOption={false}
          >
            {filteredMikrotikOptions.map((option) => (
              <Option key={option.value} value={option.label}>
                {option.label}
              </Option>
            ))}
          </Select>
        </>
      )}
      {mikrotikId && (
        <>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="mb-1 mt-2"
          >
            Profile
          </Typography>
          <Select
            placeholder="Profile"
            value={profile}
            onChange={(value) => {
              setProfile(value);
              setProfileLabel(value);
            }}
            className="w-full"
          >
            {filteredProfileOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </>
      )}
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Service Type
      </Typography>
      <Select
        placeholder="Service Type"
        value={service}
        onChange={(value) => setService(value)}
        className="w-full"
      >
        <Option value="any">Any</Option>
        <Option value="async">Async</Option>
        <Option value="l2tp">L2TP</Option>
        <Option value="ovpn">OVPN</Option>
        <Option value="pppoe">PPPOE</Option>
        <Option value="pptp">PPTP</Option>
        <Option value="sstp">SSTP</Option>
      </Select>
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Status
      </Typography>
      <Select
        placeholder="Status"
        value={status}
        onChange={(value) => setStatus(value)}
        className="w-full"
      >
        <Option value="enable">Enable</Option>
        <Option value="disable">Disable</Option>
      </Select>
      <Typography
        variant="paragraph"
        color="blue-gray"
        className="mb-1 mt-1 text-sm"
      >
        Configuration
      </Typography>
      <Select
        size="middle"
        className="w-full "
        color="blue"
        placeholder="Configuration"
        onChange={(value) => setConfiguration(value)}
        value={configuration}
      >
        <Option value="configured">Configured</Option>
        <Option value="unconfigured">Unconfigured</Option>
      </Select>
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Comment
      </Typography>
      <TextArea
        placeholder="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
    </Modal>
  );
};

export default useUpdate;
