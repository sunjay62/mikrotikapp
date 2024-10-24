import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import {
  UserPlusIcon,
  TrashIcon,
  PencilSquareIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import AddDevice from "./useCreate";
import EditDevice from "./useUpdate";
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useData } from "./useData";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const TABLE_HEAD = [
  "No",
  "Name",
  "Password",
  "Profile",
  "Service",
  "Status",
  "Ref ID",
  "Comment",
  "",
];

export function TablePpp() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const { data, refetch } = useData();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedMikrotikId, setSelectedMikrotikId] = useState(null);
  const [showPasswordId, setShowPasswordId] = useState(null);
  const navigate = useNavigate();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    filteredUsers.length > 0
      ? filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
      : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpen = () => setOpen(!open);

  const handleOpenEdit = (mikrotikId) => {
    setSelectedMikrotikId(mikrotikId);
    setOpenEdit(!openEdit);
  };

  const handleViewMikrotik = (mikrotikId) => {
    setSelectedMikrotikId(mikrotikId);
    navigate(`/admin/mikrotik/view-detail/${mikrotikId}`);
  };

  const handleDelete = async (mikrotikId) => {
    Swal.fire({
      title: "Delete Device",
      text: "Are you sure to delete this Device?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("access_token");

        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const data = { mikrotik_id: mikrotikId };

          const response = await toast.promise(
            axios.delete(`${BASE_URL}/mikrotik`, {
              ...config,
              data,
            }),
            {
              pending: "Deleting ...",
              success: "Deleted Successfully!",
            }
          );

          if (response.status === 200) {
            refetch();
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

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
            user.code &&
            user.code.toLowerCase().includes(value.toLowerCase())) ||
          (user &&
            user.ipaddress &&
            user.ipaddress.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  };

  const handleShowPassword = (mikrotikId) => {
    setShowPasswordId(showPasswordId === mikrotikId ? null : mikrotikId);
  };

  useEffect(() => {
    if (data) {
      setFilteredUsers(data);
      setDataLoaded(true);
    }
  }, [data]);

  useEffect(() => {
    if (!dataLoaded) return;
    setFilteredUsers(data);
  }, [dataLoaded]);

  return (
    <>
      <Card className="mt-8 h-full w-full rounded-3xl  dark:bg-navy-700 dark:text-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="ml-5 rounded-none dark:bg-navy-700 dark:text-white"
        >
          <div className="mb-8  items-center justify-between gap-8 ">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              PPP Client List
            </div>
            <p color="gray" className="mt-1 font-normal">
              See information about all PPP Client
            </p>
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
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row ">
              <Button
                variant="outlined"
                size="sm"
                className=" flex items-center gap-2 bg-blue-600 text-white dark:bg-brandLinear dark:text-white"
                onClick={handleOpen}
              >
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Create PPP
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-auto p-5 ">
          <table className="mt-4 w-full  min-w-max table-auto text-left">
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
                      {head} {index !== TABLE_HEAD.length - 1}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            {dataLoaded ? (
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
                        <td className={`${classes} flex justify-end`}>
                          <Tooltip content="Edit" className="bg-gray-700 ">
                            <IconButton
                              variant="text"
                              className="ml-2 border bg-blue-50 hover:bg-blue-100 dark:bg-blue-800 dark:hover:bg-blue-200"
                              onClick={() => handleOpenEdit(mikrotik_id)}
                            >
                              <PencilSquareIcon className="h-5 w-5  text-blue-400" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="View" className="bg-gray-700">
                            <IconButton
                              variant="text"
                              className="ml-2 border bg-green-50 hover:bg-green-100"
                              onClick={() => handleViewMikrotik(mikrotik_id)}
                            >
                              <AdjustmentsHorizontalIcon className="h-5 w-5 text-green-400" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Delete" className="bg-gray-700 ">
                            <IconButton
                              variant="text"
                              className="ml-2 border bg-red-50 hover:bg-red-100"
                              onClick={() => handleDelete(mikrotik_id)}
                            >
                              <TrashIcon className="h-5 w-5  text-red-400" />
                            </IconButton>
                          </Tooltip>
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
            {Math.ceil((data?.length || 0) / itemsPerPage)}
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
                currentPage === Math.ceil((data?.length || 0) / itemsPerPage)
              }
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AddDevice handleOpen={handleOpen} open={open} />
      <EditDevice
        handleOpenEdit={handleOpenEdit}
        openEdit={openEdit}
        selectedMikrotikId={selectedMikrotikId}
      />
    </>
  );
}
