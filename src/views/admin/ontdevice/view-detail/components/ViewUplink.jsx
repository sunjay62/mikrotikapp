import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  TrashIcon,
  PencilSquareIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/solid";
import EditUplink from "./UpdateUplink";
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
import Swal from "sweetalert2";
import LoadingTable from "components/loading";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

const getStatusColor = (status) => {
  switch (status) {
    case "up":
      return "bg-green-100 min-w-24  text-green-600";
    case "down":
      return "bg-red-100 min-w-24  text-red-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const TABLE_HEAD = [
  "No",
  "UPLink Port",
  "Description",
  "Port Type",
  "Status",
  "Port",
  "Mode : Tagged VLANs",
  "",
];

export function ViewUplink() {
  const { deviceId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [decodedToken, setDecodedToken] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUplink, setSelectedUplink] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

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
        `${BASE_URL_OLT}/devices/card/uplink`,
        formData,
        config
      );

      setData(responseData.data);
      setFilteredUsers(responseData.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch data");
      throw error; // Tambahkan ini untuk propagasi error
    } finally {
      setLoading(false);
    }
  };

  // Buat fungsi refetch yang akan dipass ke UpdateUplink
  const handleRefetchData = async () => {
    try {
      await fetchData();
    } catch (error) {
      console.error("Failed to refetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

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
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.log(error);
      toast.error("Failed to refresh data");
    }
  };

  const handleSearch = (value) => {
    if (!value) {
      setFilteredUsers(data);
    } else {
      const filtered = data.filter(
        (user) =>
          (user.cfg_type &&
            user.cfg_type.toLowerCase().includes(value.toLowerCase())) ||
          (user.status && user.status.toString().includes(value))
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const roleHidden = decodedToken.role === "teknisi";

  const handleViewDevice = (deviceId) => {
    navigate(`/admin/smart-olt/device/view-detail/${deviceId}`);
  };

  const handleOpenEdit = (items) => {
    setSelectedUplink(items);
    setOpenEdit(!openEdit);
  };

  return (
    <>
      <Card className="mt-8 h-full w-full rounded-none dark:bg-navy-700 dark:text-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="ml-5 rounded-none dark:bg-navy-700 dark:text-white"
        >
          <div className="mb-8 items-center justify-between gap-8">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              OLT UPLink Port List
            </div>
            <p color="gray" className="mt-1 font-normal">
              See information about all OLT UPLink Port
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
                  onClick={handleRefresh}
                >
                  Refresh OLT UPLink Port
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
                            <p className="font-normal">{actualIndex}</p>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <p className="font-normal">{items.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <p className="font-normal">
                              {items.description === "none"
                                ? "-"
                                : items.description || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <p className="font-normal">{items.port_type}</p>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <p className="font-normal">
                              <div
                                className={`flex items-center justify-center gap-3 rounded-full px-2 py-1 font-bold uppercase ${getStatusColor(
                                  items.status
                                )}`}
                              >
                                <p className="text-black text-sm font-bold">
                                  {items.status || "-"}
                                </p>
                              </div>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <p className="font-normal">{items.port}</p>
                          </div>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="w flex items-center gap-3">
                          <div className="flex flex-col">
                            <p className="font-normal">
                              {items.mode} : {items.vlan_tag}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`${classes}`}>
                        <div className="flex justify-end">
                          {!roleHidden && (
                            <>
                              <Tooltip
                                content="Configure"
                                className="bg-gray-700"
                              >
                                <IconButton
                                  variant="text"
                                  className="ml-2 border bg-blue-50 hover:bg-blue-100 dark:bg-blue-800 dark:hover:bg-blue-200"
                                  onClick={() => handleOpenEdit(items)}
                                >
                                  <PencilSquareIcon className="h-5 w-5 text-blue-400" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </div>
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
            Page {currentPage} of{" "}
            {Math.ceil(filteredUsers.length / itemsPerPage)} - Total{" "}
            {filteredUsers.length} Items
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
      {selectedUplink && (
        <EditUplink
          openEdit={openEdit}
          handleOpenEdit={handleOpenEdit}
          items={selectedUplink}
          onRefetch={handleRefetchData} // Tambahkan prop ini
        />
      )}
    </>
  );
}

export default ViewUplink;
