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
  const [itemsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

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

      // Assuming responseData.data is the array of ONT names
      setData(responseData.data);
      setFilteredUsers(responseData.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleSearch = (value) => {
    if (!value) {
      setFilteredUsers(data);
    } else {
      const filtered = data.filter((ontName) =>
        ontName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        <p className="font-normal">
          Page {currentPage} of {Math.ceil(filteredUsers.length / itemsPerPage)}{" "}
          - Total {filteredUsers.length} Items
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
  );
}

export default ViewOntList;
