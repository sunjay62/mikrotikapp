import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Modal, Select } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { useData } from "./useData";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
const { Option } = Select;

const useUpdate = ({ handleOpenEdit, openEdit, user }) => {
  const [password, setPassword] = useState("");
  const { refetch } = useData();
  const [inputsNotEmpty, setInputsNotEmpty] = useState(false);
  const [selectedSites, setSelectedSites] = useState([]);
  const [siteAccessOptions, setSiteAccessOptions] = useState([]);
  const [username, setUsername] = useState("");
  const [decodedToken, setDecodedToken] = useState({});
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const resetForm = () => {
    setPassword("");
    setSelectedSites([]); // Reset selected sites
    setUsername("");
    setRole("");
  };

  useEffect(() => {
    if (user && user.list_site_info) {
      console.log(user);
      // Set site options from the user data
      setSelectedSites(
        user.list_site_info.map((site) => ({
          label: `${site.site_info.name + " " + site.site_info.code}`,
          value: site.site_info.id,
        }))
      );
      setUsername(user.username);
      setRole(user.role);
    }
  }, [user]);

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const sitesValues = selectedSites.map((site) =>
        site.value ? site.value : site
      );

      // Create the formData object
      const formData = {
        username: username,
        role: role,
        list_site: sitesValues,
      };

      // Add password to formData only if it is not empty
      if (password) {
        formData.password = password;
      }

      console.log(formData);

      const response = await toast.promise(
        axios.put(`${BASE_URL}/userlogin`, formData, config),
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
    setInputsNotEmpty(password !== "");
  }, [password]);

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
        const options = responseData.data.map((site) => ({
          value: site.id,
          label: `${site.name} ${site.code}`,
        }));

        // Update site access options
        setSiteAccessOptions(options);

        // Set selected sites based on user data
        const selectedSiteIds = user?.list_site || [];
        const preSelectedSites = options
          .filter((option) => selectedSiteIds.includes(option.value))
          .map((option) => option.value);

        setSelectedSites(preSelectedSites);
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
  }, [refetch, navigate, user]);

  const handleSelectSites = (checkedValues) => {
    setSelectedSites(checkedValues);
  };

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

  const roleHidden =
    decodedToken.role === "teknisi" || decodedToken.role === "admin";

  return (
    <Modal
      title="Edit Account"
      open={openEdit}
      onCancel={handleOpenEdit}
      afterClose={resetForm} // Ensure form is reset after modal closes
      footer={[
        <Button
          key="confirm"
          className="bg-blue-500 text-white"
          onClick={handleCreate}
          disabled={!inputsNotEmpty}
        >
          Confirm
        </Button>,
      ]}
    >
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Username
      </Typography>
      <Input placeholder="Username" disabled value={username} />
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-2">
        Password
      </Typography>
      <div style={{ position: "relative" }}>
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        Select Role
      </Typography>
      <Select
        disabled={roleHidden}
        placeholder="Select Role"
        className="w-full"
        value={role}
        onChange={(value) => setRole(value)} // Ensure the role is updated
      >
        <Option value="superadmin">Super Admin</Option>
        <Option value="admin">Admin</Option>
        <Option value="teknisi">Teknisi</Option>
      </Select>

      <Typography variant="paragraph" color="blue-gray" className="mb-1 mt-3">
        Select Site Access
      </Typography>

      <Select
        disabled={roleHidden}
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

export default useUpdate;
