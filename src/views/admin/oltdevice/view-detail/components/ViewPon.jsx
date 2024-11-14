import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";

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
import { BASE_URL_OLT } from "libs/auth-api";
import { toast } from "react-toastify";
import LoadingTable from "components/loading";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status) {
    case "up.":
      return "bg-green-100 min-w-24 text-green-600";
    case "down.":
      return "bg-red-100 min-w-24 text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const TABLE_HEAD = [
  "Port",
  "Description",
  "State",
  "Status",
  "Total Onu",
  "Total Onu Online",
  "Average",
  "TX Power",
  "",
];

export function ViewPon() {
  const { deviceId } = useParams();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [currentPages, setCurrentPages] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [decodedToken, setDecodedToken] = useState({});
  const [loading, setLoading] = useState(true);
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
        `${BASE_URL_OLT}/devices/card/pon`,
        formData,
        config
      );

      setData(responseData.data);
      setFilteredData(responseData.data);
      // Initialize search terms and current pages for each slot
      const initialSearchTerms = {};
      const initialCurrentPages = {};
      responseData.data.forEach((slot) => {
        initialSearchTerms[slot.id] = "";
        initialCurrentPages[slot.id] = 1;
      });
      setSearchTerms(initialSearchTerms);
      setCurrentPages(initialCurrentPages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleRefresh = async () => {
    try {
      await toast.promise(fetchData(), {
        pending: "Refreshing ...",
        success: "Refresh Success!",
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to refresh data");
    }
  };

  const handleSearch = (slotId, value) => {
    setSearchTerms((prev) => ({ ...prev, [slotId]: value }));
    setCurrentPages((prev) => ({ ...prev, [slotId]: 1 }));

    const updatedFilteredData = data.map((slot) => {
      if (slot.id === slotId) {
        const filteredPorts = slot.list_port.filter((port) =>
          Object.values(port).some((val) =>
            val.toString().toLowerCase().includes(value.toLowerCase())
          )
        );
        return { ...slot, list_port: filteredPorts };
      }
      return slot;
    });

    setFilteredData(updatedFilteredData);
  };

  const handleChangeItemsPerPage = (e, slotId) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPages((prev) => ({ ...prev, [slotId]: 1 }));
  };

  const handlePageChange = (slotId, newPage) => {
    setCurrentPages((prev) => ({ ...prev, [slotId]: newPage }));
  };

  const renderPageNumbers = (slotId, totalPages) => {
    const currentPage = currentPages[slotId] || 1;
    const pageNumbers = [];
    const maxVisiblePages = 3;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          className={`px-3 ${
            currentPage === i
              ? "bg-blue-500 text-white dark:bg-blue-600"
              : "dark:border-white dark:text-white"
          }`}
          variant={currentPage === i ? "filled" : "outlined"}
          size="sm"
          onClick={() => handlePageChange(slotId, i)}
        >
          {i}
        </Button>
      );
    }

    return pageNumbers;
  };

  const renderTable = (cardData) => {
    const currentPage = currentPages[cardData.id] || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = cardData.list_port.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    const totalPages = Math.ceil(cardData.list_port.length / itemsPerPage);

    return (
      <div className="relative">
        <div className="overflow-x-auto">
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
              {paginatedData.map((item, index) => {
                const classes =
                  index === paginatedData.length - 1
                    ? "p-4"
                    : "p-4 border-blue-gray-50";

                return (
                  <tr key={item.id} className="border-b">
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <p className="font-normal">{item.port}</p>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <p className="font-normal">
                            {item.description === "none."
                              ? "-"
                              : item.description || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <p className="font-normal">{item.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <p className="font-normal">
                            <div
                              className={`flex items-center justify-center gap-3 rounded-full px-2 py-1 font-bold uppercase ${getStatusColor(
                                item.status
                              )}`}
                            >
                              <p className="text-black text-sm font-bold">
                                {item.status || "-"}
                              </p>
                            </div>
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <p className="font-normal">{item.total_onu}</p>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <p className="font-normal">{item.total_onu_online}</p>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <p className="font-normal">{item.avg_rx_onu}</p>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <p className="font-normal">{item.tx_power_olt}</p>
                        </div>
                      </div>
                    </td>
                    <td className={classes}></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-navy-700">
          <CardFooter className="border-blue-gray-50 flex items-center justify-between border-t p-4">
            <div className="flex items-center">
              <p className="text-blue-gray-600 font-normal dark:text-white">
                Page {currentPage} of {totalPages} - Total{" "}
                {cardData.list_port.length} Items
              </p>
              <select
                className="border-blue-gray-50 ml-4 rounded border p-1 dark:bg-navy-700 dark:text-white"
                value={itemsPerPage}
                onChange={(e) => handleChangeItemsPerPage(e, cardData.id)}
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
                onClick={() => handlePageChange(cardData.id, currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex gap-1">
                {renderPageNumbers(cardData.id, totalPages)}
              </div>

              <Button
                className="dark:border-white dark:text-white"
                variant="outlined"
                size="sm"
                onClick={() => handlePageChange(cardData.id, currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </div>
      </div>
    );
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
            OLT PON Ports
          </div>
          <p color="gray" className="mt-1 font-normal">
            See information about all OLT PON Ports
          </p>
        </div>
      </CardHeader>
      <CardBody className="p-5">
        {loading ? (
          <LoadingTable />
        ) : (
          filteredData.map((cardData) => (
            <div key={cardData.id} className="mb-8">
              <h3 className="mb-2 text-lg font-semibold">
                Slot {cardData.slot} - Type: {cardData.type}
              </h3>
              <div className="mb-4 flex w-full md:w-64">
                <Input
                  variant="standard"
                  className="dark:bg-navy-700 dark:text-white"
                  label="Search"
                  placeholder="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={searchTerms[cardData.id] || ""}
                  onChange={(e) => handleSearch(cardData.id, e.target.value)}
                />
              </div>
              {renderTable(cardData)}
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}

export default ViewPon;
