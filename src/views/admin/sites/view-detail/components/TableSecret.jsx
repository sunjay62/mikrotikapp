import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  CardFooter,
  Input,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useData } from "./useDataSecret";
import { BeatLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "libs/auth-api";
import { toast } from "react-toastify";
import axios from "axios";

const TABLE_HEAD = [
  "No",
  "Name",
  "Password",
  "Profile",
  "Service",
  "Status",
  "Ref ID",
  "Comment",
];
export function TableSecret() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const { data, refetch } = useData();
  const { siteId } = useParams();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showPasswordId, setShowPasswordId] = useState(null);
  const [length, setLength] = useState("");
  const navigate = useNavigate();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    filteredUsers.length > 0
      ? filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
      : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (value) => {
    if (value === "" || value === null) {
      setFilteredUsers(data);
    } else {
      const filtered = data.filter(
        (user) =>
          (user &&
            user.name &&
            user.name.toLowerCase().includes(value.toLowerCase())) ||
          (user &&
            user.service &&
            user.service.toLowerCase().includes(value.toLowerCase())) ||
          (user &&
            user.profile &&
            user.profile.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredUsers(filtered);
      setLength(filtered.length);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    if (data) {
      setFilteredUsers(data);
      setDataLoaded(true);
      setLength(data.length);
    }
  }, [data]);

  useEffect(() => {
    if (!dataLoaded || !data) return;
    setFilteredUsers(data);
  }, [dataLoaded, data]);

  const handleShowPassword = (clientId) => {
    setShowPasswordId(showPasswordId === clientId ? null : clientId);
  };

  const handleBack = () => {
    navigate(`/admin/sites`);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("access_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = {
      site_id: siteId,
    };

    try {
      const response = await toast.promise(
        axios.post(`${BASE_URL}/clientppp/@tarikdata`, formData, config),
        {
          pending: "Updating ...",
          success: "Updated Successfully!",
        }
      );

      if (response.status === 200) {
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card className="mt-8 h-full w-full pl-5 pr-5 pt-3 dark:bg-navy-700 dark:text-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none dark:bg-navy-700 dark:text-white"
        >
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <h1 className="text-xl font-bold" color="blue-gray">
                Secret List
              </h1>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4  md:flex-row">
            <div className="flex w-full md:w-64 ">
              <Input
                variant="standard"
                className="dark:bg-navy-700 dark:text-white"
                label="Search"
                placeholder="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="flex shrink-0 flex-col justify-between gap-2 sm:flex-row ">
              <Tooltip content="Update Data" className="bg-gray-700 ">
                <IconButton
                  variant="text"
                  className=" border bg-green-200 hover:bg-green-100"
                  onClick={handleUpdate}
                >
                  <ArrowPathIcon className="h-5 w-5  text-green-700" />
                </IconButton>
              </Tooltip>
              <Button
                className="bg-blue-600 hover:bg-blue-400"
                onClick={handleBack}
              >
                Back
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto px-0 ">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50  cursor-pointer border-y bg-gray-50 p-4 transition-colors dark:bg-navy-800"
                  >
                    <p
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head} {index !== TABLE_HEAD.length - 1 && <>&nbsp;</>}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            {dataLoaded && data ? (
              <tbody>
                {currentItems.map(
                  (
                    {
                      client_id,
                      mikrotik_id,
                      comment,
                      name,
                      password,
                      profile,
                      ref_id,
                      service_type,
                      status,
                    },
                    index
                  ) => {
                    const actualIndex = indexOfFirstItem + index + 1;
                    const classes =
                      index === currentItems.length - 1
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={actualIndex}>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {actualIndex}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-center font-normal"
                              >
                                {showPasswordId === client_id
                                  ? password
                                  : "********"}
                                <Tooltip
                                  content={
                                    showPasswordId === client_id
                                      ? "Hide Password"
                                      : "Show Password"
                                  }
                                  className="bg-gray-700 "
                                >
                                  <span
                                    variant="text"
                                    className="ml-3 cursor-pointer"
                                    onClick={() =>
                                      handleShowPassword(client_id)
                                    }
                                  >
                                    {showPasswordId === client_id ? (
                                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                      <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                  </span>
                                </Tooltip>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {profile}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {service_type}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {status}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {ref_id}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {comment}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            ) : (
              <div className="ml-72 mt-10 flex h-full w-full items-center justify-center">
                <BeatLoader color="#3B82F6" size={15} />
              </div>
            )}
          </table>
        </CardBody>
        <CardFooter className="border-blue-gray-50 flex items-center justify-between border-t p-4">
          <p variant="small" color="blue-gray" className="font-normal">
            Page {currentPage} of{" "}
            {Math.ceil(filteredUsers.length / itemsPerPage)} - Total {length}{" "}
            Items
          </p>
          <div className="flex gap-2">
            <Button
              className="dark:border-white dark:text-white"
              variant="outlined"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              className="dark:border-white dark:text-white"
              variant="outlined"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                currentPage === Math.ceil(filteredUsers.length / itemsPerPage)
              }
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
