import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  CardFooter,
  Input,
} from "@material-tailwind/react";
import { useData } from "./useData";
import { BeatLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";

const TABLE_HEAD = ["No", "Name", "Service", "Status", "Profile"];

export function TableSecret() {
  const [currentPage, setCurrentPage] = useState(1);
  const { nameSecret } = useParams();
  const { data, isLoading } = useData(nameSecret);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [length, setLength] = useState("");
  const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    filteredUsers.length > 0
      ? filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
      : [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleChangeItemsPerPage = (event) => {
    const newItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={currentPage === i ? "filled" : "outlined"}
          size="sm"
          className={`px-3 ${
            currentPage === i
              ? "bg-blue-500 text-white dark:bg-blue-600"
              : "dark:border-white dark:text-white"
          }`}
          onClick={() => paginate(i)}
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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

  const handleToPpp = () => {
    navigate(`/admin/ppp-client`);
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
                Secret List Profile
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
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row ">
              <Button
                variant="outlined"
                size="sm"
                className="flex items-center gap-2 bg-blue-600 text-white dark:bg-brandLinear dark:text-white"
                onClick={handleToPpp}
              >
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Secret
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <BeatLoader color="#3B82F6" size={15} />
            </div>
          ) : (
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
                    ({ name, status, service_type, profile }, index) => {
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
                                  className={`font-normal ${
                                    status === "disable"
                                      ? "bg-red-400"
                                      : "bg-green-400"
                                  } rounded pb-1 pl-2 pr-2 pt-1 text-white`}
                                >
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
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

                          {/* <td className={`${classes} flex justify-end`}>
                          <Tooltip content="Edit" className="bg-gray-700 ">
                            <IconButton
                              variant="text"
                              className="ml-2 border bg-blue-50 hover:bg-blue-100 dark:bg-blue-800 dark:hover:bg-blue-200"
                              onClick={() => handleOpenEdit(mikrotik_id)}
                            >
                              <PencilSquareIcon className="h-5 w-5  text-blue-400" />
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
                        </td> */}
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
          )}
        </CardBody>
        <CardFooter className="border-blue-gray-50 flex items-center justify-between border-t p-4">
          <div className="flex items-center">
            <p className="text-blue-gray-600 font-normal dark:text-white">
              Page {currentPage} of {totalPages} - Total {filteredUsers.length}{" "}
              Items
            </p>
            <select
              className="border-blue-gray-50 ml-4 rounded border p-1 dark:bg-navy-700 dark:text-white"
              value={itemsPerPage}
              onChange={handleChangeItemsPerPage}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
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

            <div className="flex gap-1">{renderPageNumbers()}</div>

            <Button
              className="dark:border-white dark:text-white"
              variant="outlined"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      {/* <EditSecret
        handleOpenEdit={handleOpenEdit}
        openEdit={openEdit}
        selectedMikrotikId={selectedMikrotikId}
        selectedName={selectedName}
      /> */}
    </>
  );
}
