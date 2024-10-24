import useSiteStore from "../../store/useSiteStore";
import { BASE_URL } from "libs/auth-api";
import axios from "axios";
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
import { IoIosArrowForward } from "react-icons/io";
import { motion } from "framer-motion";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const TABLE_HEAD = ["No", "Profile Name", "Local Address", "Remote Address"];

const SiteProfileDetail = () => {
  const [siteNames, setSiteNames] = useState([]);
  const [codeNames, setCodeNames] = useState([]);
  const siteIdList = useSiteStore((state) => state.siteIdList);
  const [data, setData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showTables, setShowTables] = useState({});
  const [itemsPerPage] = useState(5);
  const [length, setLength] = useState("");
  const navigate = useNavigate();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    filteredUsers.length > 0
      ? filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
      : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const mikrotikIds = siteIdList.map((mikrotik) => mikrotik.id);

        let formData;

        if (mikrotikIds.length === 1) {
          formData = { mikrotik_id: mikrotikIds[0] };
        } else {
          formData = { mikrotik_id_list: mikrotikIds };
        }

        const responseData = await axios.post(
          `${BASE_URL}/profile`,
          formData,
          config
        );

        // console.log(responseData);

        setData(responseData.data.data);
        setDataLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [siteIdList]);

  useEffect(() => {
    setSiteNames(siteIdList.map((site) => site.name));
    setCodeNames(siteIdList.map((site) => site.code));
  }, [siteIdList]);

  const handleSearch = (value) => {
    if (!value) {
      setFilteredUsers(data);
      setCurrentPage(1);
      return;
    }

    const filtered = data.filter((user) => {
      const nameMatch =
        user.name && user.name.toLowerCase().includes(value.toLowerCase());
      const localAddressMatch =
        user["local-address"] &&
        user["local-address"].toLowerCase().includes(value.toLowerCase());
      const remoteAddressMatch =
        user["remote-address"] &&
        user["remote-address"].toLowerCase().includes(value.toLowerCase());
      return nameMatch || localAddressMatch || remoteAddressMatch;
    });

    setFilteredUsers(filtered);
    setLength(filtered.length);

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
    if (!dataLoaded) return;
    setFilteredUsers(data);
  }, [dataLoaded]);

  const toggleTable = (routerName) => {
    setShowTables((prevShowTables) => ({
      ...prevShowTables,
      [routerName]: !prevShowTables[routerName],
    }));
  };

  const handleBack = () => {
    navigate(`/admin/sites`);
  };

  return (
    <div>
      <Card className="mt-8 h-full w-full pb-8 pl-5 pr-5 pt-3 dark:bg-navy-700 dark:text-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none dark:bg-navy-700 dark:text-white"
        >
          <div className="mb-5 flex  items-center justify-between gap-8">
            <div>
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Profile Detail
              </div>
              <p color="gray" className="mt-1 font-normal">
                See information about all Profile
              </p>
            </div>
            <div className="flex shrink-0 flex-col justify-between gap-2 sm:flex-row ">
              <Button
                className="bg-blue-600 hover:bg-blue-400"
                onClick={handleBack}
              >
                Back
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {siteNames.map((routerName, index) => (
              <div
                key={index}
                className=" rounded-xl bg-gray-100 p-4 text-gray-800   dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                <div className="flex items-center justify-between">
                  <h1>
                    Site Name : {routerName} ({codeNames[index]}){" "}
                  </h1>
                  <motion.div
                    initial={false}
                    animate={
                      showTables[routerName] ? { rotate: 90 } : { rotate: 0 }
                    }
                  >
                    <div
                      onClick={() => toggleTable(routerName)}
                      className="cursor-pointer rounded-full bg-gray-200 p-3 transition-all hover:bg-gray-300"
                    >
                      <IoIosArrowForward />
                    </div>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ height: showTables[routerName] ? "auto" : 0 }}
                  animate={{ height: showTables[routerName] ? "auto" : 0 }}
                  transition={{ duration: 0.3 }} // Atur durasi animasi sesuai kebutuhan
                >
                  {showTables[routerName] && ( // Hanya render jika showTable true
                    <CardBody className="px-0">
                      <Card className="h-full w-full pl-5 pr-5 pt-3 dark:bg-navy-700 dark:text-white">
                        <CardHeader
                          floated={false}
                          shadow={false}
                          className="rounded-none dark:bg-navy-700 dark:text-white"
                        >
                          <div className="mb-8  items-center justify-between gap-8">
                            <div className="text-xl font-bold text-navy-700 dark:text-white">
                              Profile List
                            </div>
                            <p color="gray" className="mt-1 font-normal">
                              See information about all Profile
                            </p>
                          </div>
                          <div className="flex flex-col items-center justify-between gap-4  md:flex-row">
                            <div className="flex w-full md:w-64 ">
                              <Input
                                variant="standard"
                                className="dark:bg-navy-700 dark:text-white"
                                label="Search"
                                placeholder="Search"
                                icon={
                                  <MagnifyingGlassIcon className="h-5 w-5" />
                                }
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
                                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                    >
                                      {head}
                                      {index !== TABLE_HEAD.length - 1 && (
                                        <>&nbsp;</>
                                      )}
                                    </p>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            {dataLoaded ? (
                              <tbody>
                                {currentItems.map(
                                  (
                                    {
                                      name,
                                      mikrotik_id,
                                      ["local-address"]: localAddress,
                                      ["remote-address"]: remoteAddress,
                                    },
                                    index
                                  ) => {
                                    const actualIndex =
                                      indexOfFirstItem + index + 1;
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
                                                {localAddress}
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
                                                {remoteAddress}
                                              </p>
                                            </div>
                                          </div>
                                        </td>
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
                        </CardBody>
                        <CardFooter className="border-blue-gray-50 flex items-center justify-between border-t p-4">
                          <p
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            Page {currentPage} of{" "}
                            {Math.ceil(
                              (filteredUsers?.length || 0) / itemsPerPage
                            )}{" "}
                            - Total {length} Items
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
                                Math.ceil((data?.length || 0) / itemsPerPage)
                              }
                            >
                              Next
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </CardBody>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SiteProfileDetail;
