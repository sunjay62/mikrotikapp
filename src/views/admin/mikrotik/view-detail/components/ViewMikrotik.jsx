import React, { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Progress,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ViewMikrotik = () => {
  const { mikrotikId } = useParams();

  const [name, setName] = useState("");
  const [cpuLoad, setCpuLoad] = useState("");
  const [boardName, setBoardName] = useState("");
  const [cpuName, setCpuName] = useState("");
  const [temperature, setTemperature] = useState("");
  const [uptime, setUptime] = useState("");
  const [freeMemory, setFreeMemory] = useState("");
  const [freeHdd, setFreeHdd] = useState("");
  const [totalMemory, setTotalMemory] = useState("");
  const [totalHdd, setTotalHdd] = useState("");
  const [version, setVersion] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const responseData = await axios.get(
        `${BASE_URL}/mikrotik?mikrotik_id=${mikrotikId}`,
        config
      );

      // console.log(responseData.data);

      if (responseData.data.current_info === null) {
        setName("");
        setCpuName("");
        setVersion("");
        setUptime("");
        setBoardName("");
        setTemperature("0");
        setCpuLoad("0");
        setFreeHdd("");
        setFreeMemory("");
        setTotalHdd("");
        setTotalMemory("");
      } else {
        setName(responseData.data.name);
        setCpuName(responseData.data.current_info.cpu);
        setVersion(responseData.data.current_info.version);
        setUptime(responseData.data.current_info.uptime);
        setBoardName(responseData.data.current_info["board-name"]);
        setTemperature(responseData.data.current_info["cpu-temperature"]);
        setCpuLoad(responseData.data.current_info["cpu-load"]);
        setFreeHdd(responseData.data.current_info["free-hdd-space"]);
        setFreeMemory(responseData.data.current_info["free-memory"]);
        setTotalHdd(responseData.data.current_info["total-hdd-space"]);
        setTotalMemory(responseData.data.current_info["total-memory"]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getProgressColor = (value) => {
    if (value >= 75) {
      return "red";
    } else if (value >= 50) {
      return "amber";
    } else if (value >= 25) {
      return "blue";
    } else {
      return "green";
    }
  };

  const bytesToMB = (bytes) => {
    const megabytes = bytes / (1024 * 1024);
    if (megabytes >= 1000) {
      return (megabytes / 1024).toFixed(2) + " GB";
    } else {
      return megabytes.toFixed(2) + " MB";
    }
  };

  const handleBack = () => {
    navigate(`/admin/mikrotik`);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("access_token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const formData = {
      mikrotik_id: mikrotikId,
    };

    try {
      const response = await toast.promise(
        axios.post(`${BASE_URL}/clientppp/@tarikdata`, formData, config),
        {
          pending: "Updating ...",
          success: "Updated Successfully!",
        }
      );

      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
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
                MikroTik {name}
              </h1>
              <p color="gray" className="mt-1 font-normal">
                See information about all this device
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Tooltip content="Update Data" className="bg-gray-700 ">
              <IconButton
                variant="text"
                className=" border bg-green-200 hover:bg-green-100"
                onClick={handleUpdate}
              >
                <ArrowPathIcon className="h-5 w-5  text-green-700" />
              </IconButton>
            </Tooltip>
            <Button
              className="bg-blue-600 hover:bg-blue-400"
              onClick={handleBack}
            >
              Back
            </Button>
          </div>
        </CardHeader>
        <div className="flex items-center justify-between"></div>
        <CardBody className="px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border p-4">Property</th>
                <td className="border p-4">
                  <div className="ml-4 font-bold">Value</div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border p-4">Board Name</th>
                <td className="border p-4">
                  <div className="ml-4">{boardName}</div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">Version</th>
                <td className="border p-4">
                  <div className="ml-4">{version}</div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">CPU</th>
                <td className="border p-4">
                  <div className="ml-4">{cpuName}</div>
                </td>
              </tr>
              <tr>
                <th className="w-5 border p-4">UP Time</th>
                <td className="border p-4">
                  <div className="ml-4">{uptime}</div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">CPU Load</th>
                <td className="border p-4">
                  <div className="flex items-center gap-3">
                    <Progress
                      value={parseFloat(
                        ((totalMemory - freeMemory) / totalMemory) * 100
                      )}
                      size="lg"
                      label=""
                      color={getProgressColor(
                        parseFloat(
                          ((totalMemory - freeMemory) / totalMemory) * 100
                        )
                      )}
                      className="ml-4 w-5/6 bg-gray-200 text-yellow-50"
                    />
                    {cpuLoad}%
                  </div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">Temperature</th>
                <td className="border p-4">
                  <div className="flex items-center gap-3">
                    <Progress
                      value={parseFloat(temperature)}
                      size="lg"
                      label=""
                      color={getProgressColor(parseFloat(temperature))}
                      className="ml-4 w-5/6 bg-gray-200 text-yellow-50"
                    />
                    {temperature}°
                  </div>
                </td>
              </tr>

              <tr>
                <th className="border p-4">Memory Used</th>
                <td className="border p-4">
                  <div className="flex items-center gap-3">
                    {totalMemory && freeMemory && (
                      <>
                        <Progress
                          value={
                            ((totalMemory - freeMemory) / totalMemory) * 100
                          }
                          size="lg"
                          label=""
                          color={getProgressColor(
                            ((totalMemory - freeMemory) / totalMemory) * 100
                          )} // Set color dynamically
                          className="ml-4 w-5/6 bg-gray-200 text-yellow-50"
                        />
                        {(
                          ((totalMemory - freeMemory) / totalMemory) *
                          100
                        ).toFixed(2)}
                        %
                      </>
                    )}
                  </div>
                  <div className="ml-4 flex">
                    {bytesToMB(freeMemory)} free of {bytesToMB(totalMemory)}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-80 border p-4">HDD Used</th>
                <td className="border p-4">
                  <div className="flex items-center gap-3">
                    {totalHdd && freeHdd && (
                      <>
                        <Progress
                          value={((totalHdd - freeHdd) / totalHdd) * 100}
                          size="lg"
                          label=""
                          color={getProgressColor(
                            ((totalHdd - freeHdd) / totalHdd) * 100
                          )}
                          className="ml-4 w-5/6 bg-gray-200 text-yellow-50"
                        />
                        {(((totalHdd - freeHdd) / totalHdd) * 100).toFixed(2)}%
                      </>
                    )}
                  </div>
                  <div className="ml-4 flex">
                    {bytesToMB(freeHdd)} free of {bytesToMB(totalHdd)}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
    </>
  );
};

export default ViewMikrotik;
