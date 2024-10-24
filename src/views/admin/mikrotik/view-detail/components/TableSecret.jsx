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
import { useData } from "./useDataSecret";
import { BeatLoader } from "react-spinners";
import { useNavigate, useParams } from "react-router-dom";

const TABLE_HEAD = ["No", "Name", "Service", "Profile"];

export function TableSecret() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const { mikrotikId } = useParams();
  const { data, isLoading } = useData(mikrotikId);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [length, setLength] = useState(0);
  const navigate = useNavigate();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (value) => {
    if (!value) {
      setFilteredUsers(data);
    } else {
      const filtered = data.filter(
        (user) =>
          (user.name &&
            user.name.toLowerCase().includes(value.toLowerCase())) ||
          (user.service &&
            user.service.toLowerCase().includes(value.toLowerCase())) ||
          (user.profile &&
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
      setLength(data.length);
    }
  }, [data]);

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
                Secret List
              </h1>
            </div>
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
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
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
                      className="border-blue-gray-100 bg-blue-gray-50/50 hover:bg-blue-gray-50 cursor-pointer border-y bg-gray-50 p-4 transition-colors dark:bg-navy-800"
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
              <tbody>
                {currentItems.map(
                  ({ name, mikrotik_id, service, profile }, index) => {
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
                                {service}
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
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          )}
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
