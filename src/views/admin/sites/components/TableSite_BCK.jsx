import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import AddSite from "./useCreate";
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { useDataSite } from "./useDataSite";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";

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
  const [itemsPerPage] = useState(5); // Jumlah item per halaman
  const { data } = useDataSite();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

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
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    if (data) {
      setFilteredUsers(data);
      setDataLoaded(true);
    }
  }, [data]);

  // console.log(data);

  useEffect(() => {
    if (!dataLoaded) return;
    setFilteredUsers(data);
  }, [dataLoaded]);

  return (
    <>
      <Card className="mt-8 h-full w-full pl-5 pr-5 dark:bg-navy-700 dark:text-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none dark:bg-navy-700 dark:text-white"
        >
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <p variant="h5" color="blue-gray">
                Site list
              </p>
              <p color="gray" className="mt-1 font-normal">
                See information about all site
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row ">
              <Button
                variant="outlined"
                size="sm"
                className="mr-2 flex items-center gap-2 bg-blue-600 text-white dark:bg-brandLinear dark:text-white"
                onClick={handleOpen}
              >
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Site
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4  md:flex-row">
            <Tabs
              value="active"
              className="w-full rounded-lg  bg-gray-50 font-bold text-gray-800 dark:bg-gray-700 dark:text-blue-900 md:w-max"
            >
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab key={value} value={value}>
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
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
          </div>
        </CardHeader>
        <CardBody className="px-0">
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
                {currentItems.map(({ name, code }, index) => {
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
                              {code}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className={`${classes} flex justify-end`}>
                        <Tooltip
                          content="Synchronize Site"
                          className="bg-gray-700 "
                        >
                          <IconButton
                            variant="text"
                            className="ml-2 border bg-green-50 hover:bg-green-100"
                            onClick={handleSync}
                          >
                            <ArrowPathIcon className="h-5 w-5  text-green-400" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : (
              <div className="ml-72 mt-10 flex h-full w-full items-center justify-center">
                <BeatLoader color="#3B82F6" size={15} />
              </div>
            )}
          </table>
        </CardBody>
        {/* Bagian footer dan navigasi halaman */}
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
      <AddSite handleOpen={handleOpen} open={open} />
    </>
  );
}
