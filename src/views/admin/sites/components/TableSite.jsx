import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  ArrowPathIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/solid";
import AddSite from "./useCreate";
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
import { useDataSite } from "./useDataSite";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { HiOutlineViewList } from "react-icons/hi";

const TABS = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Disable",
    value: "disable",
  },
  {
    label: "Posponed",
    value: "posponed",
  },
];

const TABLE_HEAD = ["No", "Site Name", "Site Code", ""];

export function TableSite() {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const { data, refetch } = useDataSite();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();
  const [length, setLength] = useState("");

  const handleOpen = () => setOpen(!open);

  const handleSync = async () => {
    const token = localStorage.getItem("access_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await toast.promise(
        axios.get(`${BASE_URL}/sites/@sync`, config),
        {
          pending: "Syncronizing ...",
          success: "Synchronize Successfully!",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

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
          (user && user.name.toLowerCase().includes(value.toLowerCase())) ||
          user.code.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
      setLength(filtered.length);
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!data) {
      refetch();
    } else {
      const sortedData = [...data].sort((a, b) => a.id - b.id);
      setFilteredUsers(sortedData);
      setDataLoaded(true);
      setLength(data.length);
    }
  }, [data, refetch]);

  useEffect(() => {
    if (!dataLoaded) return;
    const sortedData = [...data].sort((a, b) => a.id - b.id);
    setFilteredUsers(sortedData);
    setLength(sortedData.length);
  }, [dataLoaded, data]);

  const handleViewSite = (siteId) => {
    navigate(`/admin/sites/view-detail/${siteId}`);
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
              Site List
            </div>
            <p color="gray" className="mt-1 font-normal">
              See information about all Site
            </p>
          </div>
          <div className="flex flex-col items-center justify-between gap-4  md:flex-row">
            <div className="w-full md:w-64 ">
              <Input
                variant="standard"
                className="dark:bg-navy-700 dark:text-white"
                label="Search"
                placeholder="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="mr-5 flex shrink-0 flex-col gap-2 sm:flex-row ">
              <Tooltip content="Synchronize Site" className="bg-gray-700 ">
                <IconButton
                  variant="text"
                  className=" border bg-green-200 hover:bg-green-100"
                  onClick={handleSync}
                >
                  <ArrowPathIcon className="h-5 w-5  text-green-700" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-5">
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
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            {dataLoaded ? (
              <tbody>
                {currentItems.map(({ name, code, id }, index) => {
                  const actualIndex = indexOfFirstItem + index + 1;
                  const classes =
                    index === currentItems.length - 1
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={actualIndex}>
                      <td className={classes}>
                        <div className="flex items-center">
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
                        <div className="flex items-center">
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
                        <div className="flex items-center">
                          <div className="flex flex-col">
                            <p
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {code}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`${classes} flex  justify-end `}>
                        <Tooltip content="View" className="bg-gray-700">
                          <IconButton
                            variant="text"
                            className="mb-2 ml-2 border bg-green-50 hover:bg-green-100"
                            onClick={() => handleViewSite(id)}
                          >
                            <AdjustmentsHorizontalIcon className="h-5 w-5 text-green-400" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <div className="ml-52 mt-10 flex h-full w-full items-center justify-center">
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
      <AddSite handleOpen={handleOpen} open={open} />
    </>
  );
}
