import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Typography,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";

const useUpdate = ({
  handleOpenEdit,
  openEdit,
  selectedMikrotikId,
  selectedName,
}) => {
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(false);

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
          `${BASE_URL}/mikrotik/${selectedMikrotikId}/pppsecrets?name=${selectedName}`,
          config
        );

        setName(responseData.data.name);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [selectedMikrotikId]);

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
        <Button variant="gradient" color="green" onClick={handleOpenEdit}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default useUpdate;
