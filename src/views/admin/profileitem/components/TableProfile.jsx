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
  "Profile Name",
  "Local Address ",
  "Remote Address",
  "",
];

export function TableProfile() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [length, setLength] = useState("");

  const [itemsPerPage] = useState(5);
  const { data, refetch } = useData();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
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
    setSelectedClientId(mikrotikId);
    setOpenEdit(!openEdit);
  };

  const handleSearch = (value) => {
    if (value === "" || value === null) {
      setFilteredUsers(data);
      setLength(data.length); // Memperbaiki pengaturan panjang data terfilter
    } else {
      const filtered = data.filter(
        (user) =>
          (user &&
            user.name &&
            user.name.toLowerCase().includes(value.toLowerCase())) ||
          (user &&
            user["local-address"] && // Memperbaiki cara mengakses properti local-address
            user["local-address"]
              .toLowerCase()
              .includes(value.toLowerCase())) ||
          (user &&
            user["remote-address"] && // Memperbaiki cara mengakses properti remote-address
            user["remote-address"].toLowerCase().includes(value.toLowerCase()))
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
    if (!dataLoaded) return;
    setFilteredUsers(data);
  }, [dataLoaded]);

  const handleViewProfile = (name) => {
    navigate(`/admin/profile/view-detail/${name}`);
  };

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
              Profile List
            </div>
            <p color="gray" className="mt-1 font-normal">
              See information about all Profile
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
                      name,
                      mikrotik_id,
                      ["local-address"]: localAddress,
                      ["remote-address"]: remoteAddress,
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
                                className="font-normal"
                              >
                                {localAddress}
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
                                {remoteAddress}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={`${classes} flex  justify-end `}>
                          <Tooltip content="View" className="bg-gray-700">
                            <IconButton
                              variant="text"
                              className="mb-2 ml-2 border bg-green-50 hover:bg-green-100"
                              onClick={() => handleViewProfile(name)}
                            >
                              <AdjustmentsHorizontalIcon className="h-5 w-5 text-green-400" />
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
                currentPage ===
                  Math.ceil(filteredUsers.length / itemsPerPage) ||
                Math.ceil(filteredUsers.length / itemsPerPage) === 0
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
        selectedClientId={selectedClientId}
      />
    </>
  );
}
