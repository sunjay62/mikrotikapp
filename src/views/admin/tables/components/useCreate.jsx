import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useData } from "./useData";

const useCreate = ({ handleOpen, open }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [mikrotikId, setMikrotikId] = useState("");
  const [profile, setProfile] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const { refetch } = useData();
  const [mikrotikOptions, setMikrotikOptions] = useState([]);
  const [profileOptions, setProfileOptions] = useState([]);

  const resetForm = () => {
    setName("");
    setPassword("");
    setProfile("");
    setService("");
    setStatus("");
    setComment("");
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
        profile: profile.replace(/\s/g, ""),
        service_type: service,
        status: status,
      };

      // console.log(formData);

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

  return (
    <>
      <Dialog
        open={open}
        size={"xs"}
        handler={handleOpen}
        className="dark:bg-navy-700 dark:text-white"
      >
        <DialogHeader>Create New Secret</DialogHeader>
        <DialogBody>
          <Typography variant="paragraph" color="blue-gray">
            Name
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
            className="mb-1 mt-1 text-sm"
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
            className="mb-1 mt-1 text-sm"
          >
            MikroTik
          </Typography>
          <Select
            size="md"
            className="dark:bg-navy-700"
            color="blue"
            placeholder="Site ID"
            onChange={(value) => setMikrotikId(value)}
          >
            {mikrotikOptions.map((option) => (
              <Option
                key={option.value}
                value={option.value}
                className="hover:bg-gray-100"
              >
                {option.label}
              </Option>
            ))}
          </Select>
          {mikrotikId && (
            <>
              <Typography
                variant="paragraph"
                color="blue-gray"
                className="mb-1 mt-1 text-sm"
              >
                Profile
              </Typography>
              <Select
                size="md"
                className="dark:bg-navy-700"
                color="blue"
                placeholder="Site ID"
                onChange={(value) => setProfile(value)}
              >
                {profileOptions.map((option) => (
                  <Option
                    key={option.value}
                    value={option.value}
                    className="hover:bg-gray-100"
                  >
                    {option.label}
                  </Option>
                ))}
              </Select>
            </>
          )}
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="mb-1 mt-1 text-sm"
          >
            Service Type
          </Typography>
          <Select
            size="md"
            className="dark:bg-navy-700"
            color="blue"
            placeholder="Service Type"
            onChange={(value) => setService(value)}
          >
            <Option className="hover:bg-gray-100" value="any">
              Any
            </Option>
            <Option className="hover:bg-gray-100" value="async">
              Async
            </Option>
            <Option className="hover:bg-gray-100" value="l2tp">
              L2TP
            </Option>
            <Option className="hover:bg-gray-100" value="ovpn">
              OVPN
            </Option>
            <Option className="hover:bg-gray-100" value="pppoe">
              PPPOE
            </Option>
            <Option className="hover:bg-gray-100" value="pptp">
              PPTP
            </Option>
            <Option className="hover:bg-gray-100" value="sstp">
              SSTP
            </Option>
          </Select>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="mb-1 mt-1 text-sm"
          >
            Status
          </Typography>
          <Input
            size="md"
            color="blue"
            placeholder="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="dark:bg-navy-700"
          />
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="mb-1 mt-1 text-sm"
          >
            Comment
          </Typography>
          <Input
            size="md"
            color="blue"
            placeholder="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="dark:bg-navy-700"
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleCreate}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default useCreate;
