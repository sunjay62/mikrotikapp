import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import AddAccount from "./useCreate";
import EditAccount from "./useUpdate";
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
import LoadingTable from "components/loading";
import { BsPlus } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";

const TABLE_HEAD = ["No", "Username", "Role", "Site Access", ""];

export function TableAccount() {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, refetch } = useData();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [decodedToken, setDecodedToken] = useState({});
  const [length, setLength] = useState(0);
  const [loading, setLoading] = useState(true);

  // Calculate pagination values safely
  const totalItems = filteredUsers?.length || 0;

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

  useEffect(() => {
    if (data?.data) {
      setFilteredUsers(data.data);
      setLength(data.data.length);
      setLoading(false);
    }
  }, [data]);

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

  const handleOpen = () => setOpen(!open);

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setOpenEdit(!openEdit);
  };

  const handleDelete = async (username) => {
    Swal.fire({
      title: "Delete Account",
      text: "Are you sure to delete this Account?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("access_token");

        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const data = { username };

          await toast.promise(
            axios.delete(`${BASE_URL}/userlogin`, {
              ...config,
              data,
            }),
            {
              pending: "Deleting ...",
              success: "Deleted Successfully!",
            }
          );

          refetch();
        } catch (error) {
          toast.error("Error deleting account");
          console.error(error);
        }
      }
    });
  };

  const handleSearch = (value) => {
    if (!data?.data) return;

    if (!value) {
      setFilteredUsers(data.data);
      setLength(data.data.length);
    } else {
      const filtered = data.data.filter(
        (user) =>
          (user.role &&
            user.role.toLowerCase().includes(value.toLowerCase())) ||
          (user.username &&
            user.username.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredUsers(filtered);
      setLength(filtered.length);
    }
    setCurrentPage(1);
  };

  const roleHidden =
    decodedToken.role === "teknisi" || decodedToken.role === "admin";

  return (
    <>
      <Card className="mt-8 h-full w-full rounded-3xl dark:bg-navy-700 dark:text-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="ml-5 rounded-none dark:bg-navy-700 dark:text-white"
        >
          <div className="mb-8 items-center justify-between gap-8">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Account List
            </div>
            <p color="gray" className="mt-1 font-normal">
              See information about all Account
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
                  onClick={handleOpen}
                >
                  <BsPlus strokeWidth={2} className="h-4 w-4" /> Add Account
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardBody className="p-5">
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
                      {head} {index !== TABLE_HEAD.length - 1}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="p-4 text-center">
                    <LoadingTable />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {currentItems.map((user, index) => {
                  const actualIndex = indexOfFirstItem + index + 1;
                  const classes =
                    index === currentItems.length - 1
                      ? "p-4"
                      : "p-4 border-blue-gray-50";

                  const shouldHideDeleteButton =
                    decodedToken.username === user.username;

                  return (
                    <tr key={actualIndex} className="border-b">
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
                              {user.username}
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
                              {user.role}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            {user.list_site_info?.length > 0 ? (
                              user.list_site_info.map((site, index) => (
                                <p
                                  key={index}
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {site.site_info.name} ({site.site_info.code})
                                </p>
                              ))
                            ) : (
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                No site access
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <>
                          <Tooltip content="Edit" className="bg-gray-700">
                            <IconButton
                              variant="text"
                              className="ml-2 border bg-blue-50 hover:bg-blue-100 dark:bg-blue-800 dark:hover:bg-blue-200"
                              onClick={() => handleOpenEdit(user)}
                            >
                              <PencilSquareIcon className="h-5 w-5 text-blue-400" />
                            </IconButton>
                          </Tooltip>

                          {!shouldHideDeleteButton && !roleHidden && (
                            <Tooltip content="Delete" className="bg-gray-700">
                              <IconButton
                                variant="text"
                                className="dark:bg-red-00 ml-2 border bg-red-50 hover:bg-red-100 dark:hover:bg-blue-200"
                                onClick={() => handleDelete(user.username)}
                              >
                                <TrashIcon className="h-5 w-5 text-red-500" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
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

      <AddAccount open={open} handleOpen={handleOpen} refetch={refetch} />
      <EditAccount
        openEdit={openEdit}
        handleOpenEdit={handleOpenEdit}
        refetch={refetch}
        user={selectedUser}
      />
    </>
  );
}

export default TableAccount;
