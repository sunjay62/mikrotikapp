import React, { useState } from "react";
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

const useCreate = ({ handleOpen, open }) => {
  const [name, setName] = useState("");

  const resetForm = () => {
    setName("");
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
      };

      const response = await toast.promise(
        axios.post(`${BASE_URL}/sites`, formData, config),
        {
          pending: "Creating ...",
          success: "Created Successfully!",
        }
      );

      // console.log(response);

      if (response.status === 201) {
        resetForm();
        handleOpen();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>Create New Site</DialogHeader>
        <DialogBody>
          <Typography variant="h6" color="blue-gray" className="mb-3">
            Site Name
          </Typography>
          <Input
            size="lg"
            placeholder="Site Name"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            value={name}
            onChange={(e) => setName(e.target.value)}
            labelProps={{
              className: "before:content-none after:content-none",
            }}
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
