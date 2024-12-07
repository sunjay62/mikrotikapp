import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  CardFooter,
  Input,
} from "@material-tailwind/react";
import { BASE_URL_OLT } from "libs/auth-api";
import { toast } from "react-toastify";
import axiosInstance from "utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import LoadingTable from "components/loading";

const TABLE_HEAD = ["No", "Name", ""];

export function ViewOntList() {
  const { deviceId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Safely calculate pagination values with default empty array
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = (filteredUsers || []).slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Safely calculate total pages
  const totalPages = Math.max(
    1,
    Math.ceil((filteredUsers || []).length / itemsPerPage)
  );

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        throw new Error("Access token is missing.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const formData = {
        id: deviceId,
      };

      const responseData = await axiosInstance.post(
        `${BASE_URL_OLT}/devices/onutype`,
        formData,
        config
      );

      // Ensure responseData.data is an array, default to empty array if not
      const fetchedData = Array.isArray(responseData.data)
        ? responseData.data
        : [];

      setData(fetchedData);
      setFilteredUsers(fetchedData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data");
      // Set empty array in case of error
      setData([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger, deviceId]);

  const handleSearch = (value) => {
    if (!value) {
      setFilteredUsers(data);
    } else {
      const filtered = (data || []).filter((ontName) =>
        ontName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  };

  return (
    <Card className="mt-8 h-full w-full rounded-none dark:bg-navy-700 dark:text-white">
      <CardHeader
        floated={false}
        shadow={false}
        className="ml-5 rounded-none dark:bg-navy-700 dark:text-white"
      >
        <div className="mb-8 items-center justify-between gap-8">
          <div className="text-xl font-bold text-navy-700 dark:text-white">
            Compatible ONT List
          </div>
          <p className="mt-1 font-normal">See information about all ONT List</p>
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
                  <p className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
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
              currentItems.map((name, index) => {
                const actualIndex = indexOfFirstItem + index + 1;
                const classes =
                  index === currentItems.length - 1
                    ? "p-4"
                    : "p-4 border-blue-gray-50";

                return (
                  <tr key={actualIndex} className="border-b">
                    <td className={`${classes} w-[50px]`}>
                      <p className="font-normal">{actualIndex}</p>
                    </td>
                    <td className={classes}>
                      <p className="font-normal">{name}</p>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="border-blue-gray-50 flex items-center justify-between border-t p-4">
        <div className="flex items-center">
          <p className="text-blue-gray-600 font-normal dark:text-white">
            Page {currentPage} of {totalPages} - Total{" "}
            {(filteredUsers || []).length} Items
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
  );
}

export default ViewOntList;
