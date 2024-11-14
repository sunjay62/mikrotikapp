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
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { BASE_URL, BASE_URL_OLT } from "libs/auth-api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "utils/axiosInstance";
import { GrTime } from "react-icons/gr";
import { Select, Skeleton } from "antd";
const { Option } = Select;

const ViewDevice = () => {
  const { deviceId } = useParams();
  const [deviceData, setDeviceData] = useState({
    name: "",
    host: "",
    site: { id: "", name: "", code: "" },
    merk: { id: "", merk: "", model: "" },
    telnetPass: "",
    telnetUser: "",
    snmpRo: "",
    snmpWr: "",
    software: { id: "", name: "" },
    snmpPort: "",
    telnetPort: "",
    uptime: "",
  });
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [siteOptions, setSiteOptions] = useState([]);
  const [masterMerkOptions, setMasterMerkOptions] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const [showSecrets, setShowSecrets] = useState({
    telnetUser: false,
    telnetPass: false,
    snmpRo: false,
    snmpWr: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const {
      name,
      host,
      site,
      merk,
      telnetPass,
      telnetUser,
      snmpRo,
      snmpWr,
      software,
      snmpPort,
      telnetPort,
      uptime,
    } = deviceData;

    if (
      name &&
      host &&
      site.id && // ensure the site has an id
      merk.id && // ensure the merk has an id
      telnetPass &&
      telnetUser &&
      snmpRo &&
      snmpWr &&
      software.id && // ensure the software has an id
      snmpPort &&
      telnetPort &&
      uptime
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [deviceData]);

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
        `${BASE_URL_OLT}/devices/info`,
        formData,
        config
      );

      if (responseData.data.current_info === null) {
        setDeviceData({
          name: "",
          host: "",
          site: { id: "", name: "", code: "" },
          merk: { id: "", merk: "", model: "" },
          telnetPass: "",
          telnetUser: "",
          snmpRo: "",
          snmpWr: "",
          software: { id: "", name: "" },
          snmpPort: "",
          telnetPort: "",
          uptime: "",
        });
      } else {
        setDeviceData({
          name: responseData.data.name,
          host: responseData.data.host,
          site: {
            id: responseData.data.info_site.id,
            name: responseData.data.info_site.name,
            code: responseData.data.info_site.code,
          },
          telnetPass: responseData.data.telnet_pass,
          telnetUser: responseData.data.telnet_user,
          snmpRo: responseData.data.snmp_ro_com,
          snmpWr: responseData.data.snmp_wr_com,
          software: {
            id: responseData.data.info_software.id,
            name: responseData.data.info_software.name,
          },
          snmpPort: responseData.data.snmp_port,
          telnetPort: responseData.data.telnet_port,
          merk: {
            id: responseData.data.info_merk.id,
            merk: responseData.data.info_merk.merk,
            model: responseData.data.info_merk.model,
          },
          uptime: responseData.data.uptime,
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

  const toggleUpdate = () => {
    setIsUpdating(!isUpdating);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeviceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const formData = {
        id: deviceId,
        name: deviceData.name,
        host: deviceData.host,
        telnet_pass: deviceData.telnetPass,
        telnet_user: deviceData.telnetUser,
        snmp_ro_com: deviceData.snmpRo,
        snmp_wr_com: deviceData.snmpWr,
        id_site: parseInt(deviceData.site.id) || null,
        id_merk: parseInt(deviceData.merk.id) || null,
        id_software: parseInt(deviceData.software.id || null),
        snmp_port: parseInt(deviceData.snmpPort || 0),
        telnet_port: parseInt(deviceData.telnetPort || 0),
      };

      console.log(formData);

      const response = await toast.promise(
        axiosInstance.put(`${BASE_URL_OLT}/devices`, formData, config),
        {
          pending: "Updating ...",
          success: "Updated Successfully!",
        }
      );

      if (response.status === 200) {
        handleCancel();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsUpdating(false);
    fetchData(); // Refetch data to revert changes
  };

  const handleBack = () => {
    navigate(`/admin/smart-olt/device`);
  };

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const responseData = await axiosInstance.get(
          `${BASE_URL}/sites`,
          config
        );

        if (responseData && responseData.data) {
          setSiteOptions(
            responseData.data.map((site) => ({
              value: site.id,
              label: `${site.name} (${site.code})`,
            }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSites();
  }, []);

  useEffect(() => {
    const fetchMerkOptions = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          throw new Error("Access token is missing.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const responseData = await axiosInstance.get(
          `${BASE_URL_OLT}/oltmaster/merk`,
          config
        );

        setMasterMerkOptions(
          responseData.data.map((merk) => ({
            value: merk.id,
            label: `${merk.merk} - ${merk.model}`,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchMerkOptions();
  }, []);

  useEffect(() => {
    const fetchSoftwareOptions = async () => {
      if (deviceData.merk.id) {
        try {
          const token = localStorage.getItem("access_token");
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const formData = {
            id: parseInt(deviceData.merk.id),
          };

          const responseData = await axiosInstance.post(
            `${BASE_URL_OLT}/oltmaster/merk/software`,
            formData,
            config
          );

          if (responseData && responseData.data) {
            const options = responseData.data.map((software) => ({
              value: software.id,
              label: software.name,
            }));
            setSoftwareOptions(options);

            // If current software is not in the new options, reset it
            if (
              !options.some((option) => option.value === deviceData.software.id)
            ) {
              setDeviceData((prev) => ({
                ...prev,
                software: { id: "", name: "" },
              }));
            }
          }
        } catch (error) {
          console.log("Error fetching software options:", error);
          setSoftwareOptions([]);
        }
      } else {
        setSoftwareOptions([]);
      }
    };

    fetchSoftwareOptions();
  }, [deviceData.merk.id]);

  const toggleSecret = (field) => {
    setShowSecrets((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderValue = (key, value) => {
    if (isLoading) {
      return <Skeleton.Input active={true} size="small" className="p-2 pl-3" />;
    }
    if (isUpdating) {
      return (
        <input
          type="text"
          name={key}
          value={value}
          onChange={handleInputChange}
          className="w-full rounded-xl bg-blue-100 p-2 pl-3"
        />
      );
    }
    return <p className="rounded-xl bg-blue-100 p-2 pl-3">{value}</p>;
  };

  const renderValueSecret = (key, value) => {
    if (isLoading) {
      return <Skeleton.Input active={true} size="small" className="p-2 pl-3" />;
    }
    if (isUpdating) {
      return (
        <div className="relative flex items-center">
          <input
            type={showSecrets[key] ? "text" : "password"}
            name={key}
            value={value}
            onChange={handleInputChange}
            className="w-full rounded-xl bg-blue-100 p-2 pl-3"
          />
          <span
            className="absolute right-2 cursor-pointer"
            onClick={() => toggleSecret(key)}
          >
            {showSecrets[key] ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </span>
        </div>
      );
    }
    return (
      <div className="relative flex items-center">
        <p className="rounded-xl bg-blue-100 p-2 pl-3">
          {showSecrets[key] ? value : "••••••••"}
        </p>
        <span
          className="absolute right-2 cursor-pointer"
          onClick={() => toggleSecret(key)}
        >
          {showSecrets[key] ? <EyeOutlined /> : <EyeInvisibleOutlined />}
        </span>
      </div>
    );
  };

  const renderSiteSelect = () => {
    if (isLoading) {
      return <Skeleton.Input active={true} size="small" className="p-2 pl-3" />;
    }
    if (isUpdating) {
      return (
        <select
          value={deviceData.site.id}
          onChange={(e) =>
            setDeviceData((prev) => ({
              ...prev,
              site: { ...prev.site, id: e.target.value },
            }))
          }
          className=" w-[98%] rounded-xl bg-blue-100 p-2"
        >
          <option value="" disabled>
            Select a site
          </option>
          {siteOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    return (
      <p className="rounded-xl bg-blue-100 p-2 pl-3">
        {`${deviceData.site.name} (${deviceData.site.code})`}
      </p>
    );
  };

  const renderMerkSelect = () => {
    if (isLoading) {
      return <Skeleton.Input active={true} size="small" className="p-2 pl-3" />;
    }
    if (isUpdating) {
      return (
        <select
          value={deviceData.merk.id}
          onChange={(e) =>
            setDeviceData((prev) => ({
              ...prev,
              merk: { ...prev.merk, id: e.target.value },
            }))
          }
          className="w-[98%] rounded-xl bg-blue-100 p-2 pr-3"
        >
          {masterMerkOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    return (
      <p className="rounded-xl bg-blue-100 p-2 pl-3">
        {`${deviceData.merk.merk} - ${deviceData.merk.model}`}
      </p>
    );
  };

  const renderSoftwareSelect = () => {
    if (isLoading) {
      return <Skeleton.Input active={true} size="small" className="p-2 pl-3" />;
    }
    if (isUpdating) {
      return (
        <select
          value={deviceData.software.id}
          onChange={(e) => {
            const selectedOption = softwareOptions.find(
              (option) => option.value === e.target.value
            );
            setDeviceData((prev) => ({
              ...prev,
              software: {
                id: e.target.value,
                name: selectedOption ? selectedOption.label : "",
              },
            }));
          }}
          className="w-[98%] rounded-xl bg-blue-100 p-2 pr-3"
        >
          <option value="">Select software</option>
          {softwareOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    return (
      <p className="rounded-xl bg-blue-100 p-2 pl-3">
        {`${deviceData.software.name}`}
      </p>
    );
  };

  return (
    <>
      <Card className="h-full w-full rounded-none dark:bg-navy-700 dark:text-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none dark:bg-navy-700 dark:text-white"
        >
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <h1 className="text-xl font-bold" color="blue-gray">
                Device {deviceData.name}
              </h1>
              <p color="gray" className="mt-1 font-normal">
                See information about all this device
              </p>
            </div>
            {/* <Button
              className=" bg-blue-600 hover:bg-blue-700"
              onClick={handleBack}
            >
              Back
            </Button> */}
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
            <Button
              className={`transition-all ${
                isUpdating
                  ? "bg-red-400 hover:bg-red-500"
                  : "bg-blue-400 hover:bg-blue-500"
              }`}
              onClick={toggleUpdate}
            >
              {isUpdating ? "Cancel" : "Edit Device"}
            </Button>
          </div>
        </CardHeader>
        <div className="flex items-center justify-between"></div>
        <CardBody className="px-0 ">
          <table className="w-full min-w-max table-auto text-left dark:text-gray-800">
            <thead>
              <tr>
                <th className="w-[350px]  p-1">
                  <p className="flex justify-center rounded-xl bg-gray-100 p-4">
                    Property
                  </p>
                </th>
                <td>
                  <div className="ml-4 rounded-xl bg-blue-100  font-bold">
                    <p className="flex justify-center rounded-xl bg-blue-100 p-4">
                      Value
                    </p>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="w-[350px]  p-1">
                  <p className="rounded-xl bg-gray-100 p-2">OLT Name</p>
                </th>
                <td className="text-gray-900">
                  <div className="ml-4 rounded-xl bg-blue-100 ">
                    {renderValue("name", deviceData.name)}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-[350px]  p-1 ">
                  <p className="rounded-xl bg-gray-100 p-2">OLT IP</p>
                </th>
                <td className="text-gray-900">
                  <div className="ml-4 rounded-xl bg-blue-100 ">
                    {renderValue("host", deviceData.host)}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-[350px]  p-1">
                  <p className="rounded-xl bg-gray-100 p-2">Site Information</p>
                </th>
                <td className="text-gray-900">
                  <div className="ml-4 rounded-xl bg-blue-100 ">
                    {renderSiteSelect()}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-[350px]  p-1">
                  <p className="rounded-xl bg-gray-100 p-2">Telnet TCP Port</p>
                </th>
                <td className="text-gray-900">
                  <div className="ml-4 rounded-xl bg-blue-100 ">
                    {renderValue("telnetPort", deviceData.telnetPort)}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-[350px] p-1">
                  <p className="rounded-xl bg-gray-100 p-2">
                    OLT Telnet Username
                  </p>
                </th>
                <td className="text-gray-900">
                  <div className="ml-4 rounded-xl bg-blue-100 ">
                    {renderValueSecret("telnetUser", deviceData.telnetUser)}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-[350px] p-1">
                  <p className="rounded-xl bg-gray-100 p-2">
                    OLT Telnet Password
                  </p>
                </th>
                <td className="text-gray-900">
                  <div className="ml-4 rounded-xl bg-blue-100 ">
                    {renderValueSecret("telnetPass", deviceData.telnetPass)}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-[350px] p-1">
                  <p className="rounded-xl bg-gray-100 p-2">
                    SNMP Read-Only Community
                  </p>
                </th>
                <td className="text-gray-900">
                  <div className="ml-4 rounded-xl bg-blue-100 ">
                    {renderValueSecret("snmpRo", deviceData.snmpRo)}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-[350px] p-1">
                  <p className="rounded-xl bg-gray-100 p-2">
                    SNMP Read-Write Community
                  </p>
                </th>
                <td className="text-gray-900">
                  <div className="ml-4 rounded-xl bg-blue-100 ">
                    {renderValueSecret("snmpWr", deviceData.snmpWr)}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-[350px]  p-1">
                  <p className="rounded-xl bg-gray-100 p-2">SNMP Port</p>
                </th>
                <td className="text-gray-900">
                  <div className="ml-4 rounded-xl bg-blue-100 ">
                    {renderValue("snmpPort", deviceData.snmpPort)}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-[350px]  p-1">
                  <p className="rounded-xl bg-gray-100 p-2">
                    OLT Hardware Version
                  </p>
                </th>
                <td className="text-gray-900">
                  <div className="ml-4 rounded-xl bg-blue-100 ">
                    {renderMerkSelect()}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="w-[350px]  p-1">
                  <p className="rounded-xl bg-gray-100 p-2">
                    OLT Software Version
                  </p>
                </th>
                <td className="text-gray-900">
                  <div className="ml-4 rounded-xl bg-blue-100 ">
                    {renderSoftwareSelect()}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          {isUpdating && (
            <div className="mt-5 flex items-center justify-end gap-2 ">
              <Button
                className="bg-blue-400 hover:bg-blue-600"
                onClick={handleSubmit}
                disabled={!isFormValid}
              >
                Submit
              </Button>
              <Button
                className="bg-red-400 hover:bg-red-600"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default ViewDevice;
