import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  TrashIcon,
  PencilSquareIcon,
  EyeSlashIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import AddAccount from "./useCreate";
import EditTcont from "./useUpdate";
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
import { BASE_URL_OLT } from "libs/auth-api";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoadingTable from "components/loading";
import { BsPlus } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const TABLE_HEAD = [
  "No",
  "Name",
  "IP Host",
  "Telnet Port",
  "SNMP Port",
  "OLT Merk Version",
  "Software Version",
  "",
];

export function TableOnuType() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const { data, refetch } = useData();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedOnuType, setSelectedOnuType] = useState(null);
  const [decodedToken, setDecodedToken] = useState({});
  const [length, setLength] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const navigate = useNavigate();

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setFilteredUsers(data);
      setLength(data.length);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [data]);

  console.log(data);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        const decodedToken = jwtDecode(accessToken);
        setDecodedToken(decodedToken);
      } catch (error) {
        toast.error("Your session is expired, please login again.");
      }
    }
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpen = () => setOpen(!open);

  const handleOpenEdit = (items) => {
    setSelectedOnuType(items);
    setOpenEdit(!openEdit);
  };

  const handleDelete = async (item) => {
    console.log(item);
    const name = item.name;
    const id = item.id;

    Swal.fire({
      title: "Delete OLT Device",
      text: `Are you sure to delete this ${name} OLT Device?`,
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

          const data = { id };

          await toast.promise(
            axiosInstance.delete(`${BASE_URL_OLT}/devices`, {
              ...config,
              data,
            }),
            {
              pending: "Deleting ...",
              success: `Deleted  ${name} Successfully!`,
            }
          );

          refetch();
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleSearch = (value) => {
    if (!value) {
      setFilteredUsers(data || []);
    } else {
      const filtered = data.filter(
        (user) =>
          (user.name &&
            user.name.toLowerCase().includes(value.toLowerCase())) ||
          (user.type && user.type.toString().includes(value))
      );
      setFilteredUsers(filtered);
      setLength(filtered.length);
    }
    setCurrentPage(1);
  };

  const roleHidden = decodedToken.role === "teknisi";

  const handleViewDevice = (deviceId) => {
    setSelectedDeviceId(deviceId);
    navigate(`/admin/smart-olt/device/view-detail/${deviceId}`);
  };

  return (
    <>
      <Card className="mt-8 h-full w-full rounded-3xl dark:bg-navy-700 dark:text-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="ml-5 rounded-none dark:bg-navy-700 dark:text-white"
        >
          <div className="mb-8 items-center justify-between gap-8">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              OLT Device List
            </div>
            <p color="gray" className="mt-1 font-normal">
              See information about all OLT Device
            </p>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex w-full md:w-64">
              <Input
                variant="standard"
                className="dark:bg-navy-700 dark:text-white"
                label="Search"
                placeholder="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            {!roleHidden && (
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button
                  variant="outlined"
                  size="sm"
                  className="flex items-center gap-2 bg-blue-600 text-white dark:bg-brandLinear dark:text-white"
                  onClick={handleOpen}
                >
                  <BsPlus strokeWidth={2} className="h-4 w-4" /> Add OLT Device
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardBody className="overflow-auto p-5">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50 cursor-pointer border-y bg-gray-50 p-4 transition-colors dark:bg-navy-800"
                  >
                    <p
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                    <LoadingTable />
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                    No results found
                  </td>
                </tr>
              ) : (
                currentItems.map((items, index) => {
                  const actualIndex = indexOfFirstItem + index + 1;
                  const classes =
                    index === currentItems.length - 1
                      ? "p-4"
                      : "p-4 border-blue-gray-50";

                  const shouldHideDeleteButton =
                    decodedToken.name === items.name;

                  return (
                    <tr key={items.id} className="border-b">
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
                              {items.name}
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
                              {items.host}
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
                              {items.telnet_port}
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
                              {items.snmp_port}
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
                              {items.info_merk.merk} - {items.info_merk.model}
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
                              {items.info_software.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`${classes}`}>
                        <>
                          {/* {!shouldHideDeleteButton && !roleHidden && (
                            <Tooltip content="Edit" className="bg-gray-700">
                              <IconButton
                                variant="text"
                                className="ml-2 border bg-blue-50 hover:bg-blue-100 dark:bg-blue-800 dark:hover:bg-blue-200"
                                onClick={() => handleOpenEdit(items)}
                              >
                                <PencilSquareIcon className="h-5 w-5 text-blue-400" />
                              </IconButton>
                            </Tooltip>
                          )} */}
                          {!shouldHideDeleteButton && !roleHidden && (
                            <Tooltip content="View" className="bg-gray-700">
                              <IconButton
                                variant="text"
                                className=" ml-2 border bg-green-50 hover:bg-green-100"
                                onClick={() => handleViewDevice(items.id)}
                              >
                                <AdjustmentsHorizontalIcon className="h-5 w-5 text-green-400" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {!shouldHideDeleteButton && !roleHidden && (
                            <Tooltip content="Delete" className="bg-gray-700">
                              <IconButton
                                variant="text"
                                className="dark:bg-red-00 ml-2 border bg-red-50 hover:bg-red-100 dark:hover:bg-blue-200"
                                onClick={() => handleDelete(items)}
                              >
                                <TrashIcon className="h-5 w-5 text-red-500" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
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
              disabled={currentPage === 1 || filteredUsers.length === 0}
            >
              Previous
            </Button>
            <Button
              className="dark:border-white dark:text-white"
              variant="outlined"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={
                indexOfLastItem >= filteredUsers.length ||
                filteredUsers.length === 0
              }
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      <AddAccount open={open} handleOpen={handleOpen} refetch={refetch} />
      {selectedOnuType && (
        <EditTcont
          openEdit={openEdit}
          handleOpenEdit={handleOpenEdit}
          items={selectedOnuType}
        />
      )}
    </>
  );
}

export default TableOnuType;