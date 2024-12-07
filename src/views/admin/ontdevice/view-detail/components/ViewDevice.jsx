import React, { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "utils/axiosInstance";
import { GrTime } from "react-icons/gr";
import { Skeleton } from "antd";
import { BASE_URL_DEV } from "libs/auth-api";

const ViewDevice = () => {
  const { deviceId } = useParams();
  const [deviceData, setDeviceData] = useState({
    name: "",
    name_device: "",
    onu: "",
    onu_type: "",
    site: {
      id: "",
      name: "",
    },
    sn: "",
    description: "",
    uptime: "",
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  console.log(deviceId);

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
        `${BASE_URL_DEV}/olt/onu/configured/info`,
        formData,
        config
      );

      console.log(responseData.data);

      if (responseData.current_info === null) {
        setDeviceData({
          name: "",
          name_device: "",
          onu: "",
          onu_type: "",
          site_name: "",
          sn: "",
          description: "",
          uptime: "",
        });
      } else {
        setDeviceData({
          name: responseData.data.name || "",
          name_device: responseData.data.name_device || "",
          onu: responseData.data.onu || "",
          onu_type: responseData.data.onu_type || "",
          site_name: responseData.data.site_name || "",
          sn: responseData.data.sn || "",
          description: responseData.data.description || "",
          uptime: responseData.data.uptime || "",
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [deviceId]);

  const renderValue = (value) => {
    if (isLoading) {
      return <Skeleton.Input active={true} size="small" className="p-2 pl-3" />;
    }
    return <p className="rounded-xl bg-blue-100 p-2 pl-3">{value || "N/A"}</p>;
  };

  return (
    <Card className="h-full w-full rounded-none dark:bg-navy-700 dark:text-white">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none dark:bg-navy-700 dark:text-white"
      >
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <h1 className="text-xl font-bold" color="blue-gray">
              ONU Device Details
            </h1>
            <p color="gray" className="mt-1 font-normal">
              Detailed information about the ONU device
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 rounded-md border bg-blue-400 p-2 font-bold text-white ">
            <GrTime />
            <h1>Uptime </h1>:
            {isLoading ? (
              <Skeleton.Input active={true} size="small" />
            ) : (
              <p> {deviceData.uptime}</p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-0 ">
        <table className="w-full min-w-max table-auto text-left dark:text-gray-800">
          <thead>
            <tr>
              <th className="w-[350px] p-1">
                <p className="flex justify-center rounded-xl bg-gray-100 p-4">
                  Property
                </p>
              </th>
              <td>
                <div className="ml-4 rounded-xl bg-blue-100 font-bold">
                  <p className="flex justify-center rounded-xl bg-blue-100 p-4">
                    Value
                  </p>
                </div>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="w-[350px] p-1">
                <p className="rounded-xl bg-gray-100 p-2">Name</p>
              </th>
              <td className="text-gray-900">
                <div className="ml-4 rounded-xl bg-blue-100">
                  {renderValue(deviceData.name)}
                </div>
              </td>
            </tr>
            <tr>
              <th className="w-[350px] p-1">
                <p className="rounded-xl bg-gray-100 p-2">Device Name</p>
              </th>
              <td className="text-gray-900">
                <div className="ml-4 rounded-xl bg-blue-100">
                  {renderValue(deviceData.name_device)}
                </div>
              </td>
            </tr>
            <tr>
              <th className="w-[350px] p-1">
                <p className="rounded-xl bg-gray-100 p-2">ONU</p>
              </th>
              <td className="text-gray-900">
                <div className="ml-4 rounded-xl bg-blue-100">
                  {renderValue(deviceData.onu)}
                </div>
              </td>
            </tr>
            <tr>
              <th className="w-[350px] p-1">
                <p className="rounded-xl bg-gray-100 p-2">ONU Type</p>
              </th>
              <td className="text-gray-900">
                <div className="ml-4 rounded-xl bg-blue-100">
                  {renderValue(deviceData.onu_type)}
                </div>
              </td>
            </tr>
            {/* <tr>
              <th className="w-[350px] p-1">
                <p className="rounded-xl bg-gray-100 p-2">Site ID</p>
              </th>
              <td className="text-gray-900">
                <div className="ml-4 rounded-xl bg-blue-100">
                  {renderValue(deviceData.site.id)}
                </div>
              </td>
            </tr> */}
            <tr>
              <th className="w-[350px] p-1">
                <p className="rounded-xl bg-gray-100 p-2">Site Name</p>
              </th>
              <td className="text-gray-900">
                <div className="ml-4 rounded-xl bg-blue-100">
                  {renderValue(deviceData.site_name)}
                </div>
              </td>
            </tr>
            <tr>
              <th className="w-[350px] p-1">
                <p className="rounded-xl bg-gray-100 p-2">Serial Number</p>
              </th>
              <td className="text-gray-900">
                <div className="ml-4 rounded-xl bg-blue-100">
                  {renderValue(deviceData.sn)}
                </div>
              </td>
            </tr>
            <tr>
              <th className="w-[350px] p-1">
                <p className="rounded-xl bg-gray-100 p-2">Description</p>
              </th>
              <td className="text-gray-900">
                <div className="ml-4 rounded-xl bg-blue-100">
                  {renderValue(deviceData.description)}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
};

export default ViewDevice;
