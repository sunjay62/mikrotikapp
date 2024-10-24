import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
  Option,
  Select,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
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
  const [ipAddressError, setIpAddressError] = useState(""); // New state for IP Address validation error
  const { refetch } = useData();

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

      const response = await toast.promise(
        axios.put(`${BASE_URL}/mikrotik`, formData, config),
        {
          pending: "Updating ...",
          success: "Updated Successfully!",
        }
      );

      if (response.status === 200) {
        handleOpenEdit();
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
      setSiteId(selectedOption.value); // Mengatur site_id dengan nilai value dari opsi yang dipilih
    }
  };

  // Handle IP Address change
  const handleIpAddressChange = (e) => {
    const value = e.target.value;
    setIpAddress(value);
    // Set error state based on validation result
    setIpAddressError(validateIpAddress(value)); // Set ipAddressError as string message
  };

  // validateIpAddress function
  const validateIpAddress = (value) => {
    const ipAddressPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipParts = value.split(".");
    if (
      ipParts.length !== 4 ||
      ipParts.some((part) => !ipAddressPattern.test(part))
    ) {
      return "Invalid IP Address"; // Return error message if there's an error
    } else {
      return ""; // Return empty string if there's no error
    }
  };

  return (
    <Dialog
      open={openEdit}
      size={"xs"}
      handler={handleOpenEdit}
      className="dark:bg-navy-700 dark:text-white"
    >
      <DialogHeader>Edit Device</DialogHeader>
      <DialogBody>
        <Typography variant="paragraph" color="blue-gray">
          Device Name
        </Typography>
        <Input
          size="md"
          color="blue"
          placeholder="Device Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="dark:bg-navy-700"
        />
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-3 text-sm"
        >
          IP Address
        </Typography>
        <Input
          size="md"
          className="dark:bg-navy-700"
          color="blue"
          placeholder="IP Address"
          value={ipAddress}
          onChange={handleIpAddressChange}
          error={!!ipAddressError} // Convert ipAddressError to boolean
        />
        {ipAddressError && (
          <Typography variant="paragraph" color="red">
            {ipAddressError}
          </Typography>
        )}
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-3 text-sm"
        >
          Username
        </Typography>
        <Input
          size="md"
          className="dark:bg-navy-700"
          color="blue"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-3 text-sm"
        >
          Password
        </Typography>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            size="md"
            className="dark:bg-navy-700"
            color="blue"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeSlashIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-3 text-sm"
        >
          Site ID
        </Typography>
        <Select
          size="md"
          className="dark:bg-navy-700"
          color="blue"
          value={siteLabel}
          onChange={handleChangeSite} // Menggunakan handleChangeSite
        >
          {siteOptions.map((option) => (
            <Option
              key={option.value}
              value={option.label} // Memilih label sebagai value
              className="hover:bg-gray-100"
            >
              {option.label}
            </Option>
          ))}
        </Select>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 mt-3 text-sm"
        >
          API Port
        </Typography>
        <Input
          type="number"
          size="md"
          className="dark:bg-navy-700"
          color="blue"
          placeholder="API Port"
          value={apiPort}
          onChange={(e) => setApiPort(e.target.value)}
        />
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={handleOpenEdit}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="green" onClick={handleUpdate}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default useUpdate;
