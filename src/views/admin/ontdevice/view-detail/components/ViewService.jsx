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
import { BASE_URL } from "libs/auth-api";
import { toast } from "react-toastify";
import LoadingTable from "components/loading";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "utils/axiosInstance";
import { useParams } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

export function ViewService() {
  const { deviceId } = useParams();
  const [tcontData, setTcontData] = useState([]);
  const [gemportData, setGemportData] = useState([]);
  const [servicePortData, setServicePortData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPages, setCurrentPages] = useState({
    tcont: 1,
    gemport: 1,
    servicePort: 1,
  });

  // Define column configurations with custom order options
  const tableConfigs = {
    tcont: {
      defaultHeaders: ["ONU ID", "Name", "Profile", "TCONT ID"],
      columnOrder: ["ONU ID", "Name", "Profile", "TCONT ID"],
      keyMapping: {
        "ONU ID": "id_onu",
        Name: "name",
        Profile: "profile",
        "TCONT ID": "tcont_id",
      },
    },
    gemport: {
      defaultHeaders: [
        "Downstream",
        "ONU ID",
        "Gemport ID",
        "Name",
        "TCONT ID",
        "Upstream",
      ],
      columnOrder: [
        "ONU ID",
        "Downstream",
        "Gemport ID",
        "Name",
        "TCONT ID",
        "Upstream",
      ],
      keyMapping: {
        "ONU ID": "id_onu",
        Downstream: "downstream",
        "Gemport ID": "gemport_id",
        Name: "name",
        "TCONT ID": "tcont_id",
        Upstream: "upstream",
      },
    },
    servicePort: {
      defaultHeaders: ["Description", "ONU ID", "Service ID", "VLAN", "Port"],
      columnOrder: ["ONU ID", "Service ID", "VLAN", "Port", "Description"],
      keyMapping: {
        Description: "description",
        "ONU ID": "id_onu",
        "Service ID": "service_id",
        VLAN: "vlan",
        Port: "vport",
      },
    },
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        id: deviceId,
      };

      const responseData = await axiosInstance.post(
        `${BASE_URL}/olt/onu/configured/info`,
        formData,
        config
      );

      // Set data from response
      setTcontData(responseData.data.list_tcont || []);
      setGemportData(responseData.data.list_gemport || []);
      setServicePortData(responseData.data.list_service_port || []);

      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [deviceId]);

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

  const renderTable = (dataList, slotId) => {
    const config = tableConfigs[slotId];
    const currentPage = currentPages[slotId] || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = dataList.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(dataList.length / itemsPerPage);

    return (
      <div className="relative">
        <div className="overflow-x-auto">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {config.columnOrder.map((head) => (
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
                const actualIndex = startIndex + index + 1;
                const classes = "p-4 border-b";

                return (
                  <tr key={item.id || index}>
                    {config.columnOrder.map((columnHeader) => {
                      const key = config.keyMapping[columnHeader];
                      return (
                        <td key={columnHeader} className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p className="font-normal">
                                {item[key] === null ? "-" : item[key]}
                              </p>
                            </div>
                          </div>
                        </td>
                      );
                    })}
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
                Page {currentPage} of {totalPages} - Total {dataList.length}{" "}
                Items
              </p>
              <select
                className="border-blue-gray-50 ml-4 rounded border p-1 dark:bg-navy-700 dark:text-white"
                value={itemsPerPage}
                onChange={(e) => handleChangeItemsPerPage(e, slotId)}
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
                onClick={() => handlePageChange(slotId, currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <div className="flex gap-1">
                {renderPageNumbers(slotId, totalPages)}
              </div>

              <Button
                className="dark:border-white dark:text-white"
                variant="outlined"
                size="sm"
                onClick={() => handlePageChange(slotId, currentPage + 1)}
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
            ONU Configured Information
          </div>
          <p color="gray" className="mt-1 font-normal">
            See detailed information about ONU configuration
          </p>
        </div>
      </CardHeader>
      <CardBody className="p-5">
        {loading ? (
          <LoadingTable />
        ) : (
          <>
            {/* TCONT Table */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold">TCONT List</h3>
              {renderTable(tcontData, "tcont")}
            </div>

            {/* Gemport Table */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold">Gemport List</h3>
              {renderTable(gemportData, "gemport")}
            </div>

            {/* Service Port Table */}
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold">Service Port List</h3>
              {renderTable(servicePortData, "servicePort")}
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}

export default ViewService;
