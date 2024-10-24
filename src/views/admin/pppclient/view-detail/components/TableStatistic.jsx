import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import dayjs from "dayjs";
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
import LineChart from "components/charts/LineChart";
import { DatePicker, Space } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;

const TableStatistic = () => {
  const { client_id } = useParams();
  const [lastDisconnect, setLastDisconnect] = useState("");
  const [lastLoggedOut, setLastLoggedOut] = useState("");
  const [lastLinkUp, setLastLinkUp] = useState("");
  const [localAddress, setLocalAddress] = useState("");
  const [remoteAddress, setRemoteAddress] = useState("");
  const [rxByte, setRxByte] = useState("");
  const [rxPacket, setRxPacket] = useState("");
  const [txByte, setTxByte] = useState("");
  const [txPacket, setTxPacket] = useState("");
  const [refId, setRefId] = useState("");
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [uptime, setUptime] = useState("");
  const [totalByte, setTotalByte] = useState("");
  const [totalPacket, setTotalPacket] = useState("");
  const navigate = useNavigate();
  const [dataTraffic, setDataTraffic] = useState([]);
  const [dataPacket, setDataPacket] = useState([]);
  const [selectedRange, setSelectedRange] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const responseData = await axios.get(
        `${BASE_URL}/clientppp?client_id=${client_id}&stats=1`,
        config
      );

      if (responseData.data.current_info === null) {
        setLastDisconnect("");
        setName("");
        setLastLoggedOut("");
        setLastLinkUp("");
        setLocalAddress("");
        setRemoteAddress("");
        setRxByte("");
        setRxPacket("");
        setTxByte("");
        setTxPacket("");
        setRefId("");
        setComment("");
        setUptime("");
      } else {
        setName(responseData.data.name);
        setLastDisconnect(responseData.data.last_disconnect_reason);
        setLastLoggedOut(responseData.data.last_logged_out);
        setLastLinkUp(responseData.data.last_link_up_time);
        setLocalAddress(responseData.data.local_address);
        setRemoteAddress(responseData.data.remote_address);
        setRxByte(responseData.data.rx_byte);
        setRxPacket(responseData.data.rx_packet);
        setTxByte(responseData.data.tx_byte);
        setTxPacket(responseData.data.tx_packet);
        setRefId(responseData.data.ref_id);
        setComment(responseData.data.comment);
        setUptime(responseData.data.uptime);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onChangeRange = (dates, dateStrings) => {
    const startDate = moment(dateStrings[0]).format("YYYY-MM-DD HH:mm:ss");
    const endDate = moment(dateStrings[1]).format("YYYY-MM-DD HH:mm:ss");
    setSelectedRange([startDate, endDate]);
  };

  const getDataStatistik = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const startData = selectedRange[0];
      const endData = selectedRange[1];

      const formData = {
        client_name: name,
        start_datetime: startData,
        end_datetime: endData,
      };

      const responseData = await toast.promise(
        axios.post(`${BASE_URL}/clientppp/statistic`, formData, config),
        {
          pending: "Getting statistical data...",
          success: "Statistical data retrieved successfully!",
        }
      );

      setTotalByte(responseData.data.total_byte);
      setTotalPacket(responseData.data.total_packet);

      const formattedData = responseData.data.data.map((item) => ({
        x: item.timestamp,
        y1: item.rx_byte,
        y2: item.tx_byte,
      }));

      const formattedDataPacket = responseData.data.data.map((item) => ({
        x: item.timestamp,
        y1: item.rx_packet,
        y2: item.tx_packet,
      }));

      setDataTraffic(formattedData);
      setDataPacket(formattedDataPacket);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refresh_token");

          const refreshResponse = await axios.post(
            `${BASE_URL}/userlogin/@refresh_token`,
            {
              refresh_token: refreshToken,
            }
          );

          if (refreshResponse.data && refreshResponse.data.access_token) {
            localStorage.setItem(
              "access_token",
              refreshResponse.data.access_token
            );
          }
        } catch (refreshError) {
          if (axios.isAxiosError(refreshError)) {
            if (
              refreshError.response &&
              (refreshError.response.status === 401 ||
                refreshError.response.status === 422)
            ) {
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              navigate("/login");
              toast.error("Your session is expired, please login again.");
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    getDataStatistik();
  }, [selectedRange]);

  const handleBack = () => {
    navigate(`/admin/ppp-client`);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const areaLineOptions = {
    series: [
      {
        name: "RX Byte",
        data: dataTraffic.map((item) => ({
          x: item.x,
          y: item.y1,
        })),
      },
      {
        name: "TX Byte",
        data: dataTraffic.map((item) => ({
          x: item.x,
          y: item.y2,
        })),
      },
    ],
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: dataTraffic.map((item) => ({
        x: item.x,
      })),
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return formatBytes(value);
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return formatBytes(value);
        },
      },
    },
  };

  const areaLineOptionsPacket = {
    series: [
      {
        name: "RX Packet",
        data: dataPacket.map((item) => ({
          x: item.x,
          y: item.y1,
        })),
      },
      {
        name: "TX Packet",
        data: dataPacket.map((item) => ({
          x: item.x,
          y: item.y2,
        })),
      },
    ],
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: dataPacket.map((item) => ({
        x: item.x,
      })),
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value;
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return value;
        },
      },
    },
  };

  return (
    <>
      <Card className="mt-8 h-full w-full pl-5 pr-5 pt-3 dark:bg-navy-700 dark:text-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none dark:bg-navy-700 dark:text-white"
        >
          <div className="flex items-center justify-between gap-8">
            <div>
              <h1 className="text-xl font-bold" color="blue-gray">
                Client {name}
              </h1>
              <p color="gray" className="mt-1 font-normal">
                See information about all this client
              </p>
            </div>
            <Button
              className=" bg-blue-500 hover:bg-blue-600"
              onClick={handleBack}
            >
              Back
            </Button>
          </div>
        </CardHeader>
        <div className="flex items-center justify-between"></div>
        <CardBody className="px-0">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border p-4">Name</th>
                <td className="border p-4">
                  <div className="ml-4 font-bold">Value</div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="border p-4">Ref ID</th>
                <td className="border p-4">
                  <div className="ml-4">{refId}</div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">Local Address</th>
                <td className="border p-4">
                  <div className="ml-4">{localAddress}</div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">Remote Address</th>
                <td className="border p-4">
                  <div className="ml-4">{remoteAddress}</div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">Last Link Up</th>
                <td className="border p-4">
                  <div className="ml-4">{lastLinkUp}</div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">Last Logged Out</th>
                <td className="border p-4">
                  <div className="ml-4">{lastLoggedOut}</div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">RX Packet</th>
                <td className="border p-4">
                  <div className="ml-4">{rxPacket}</div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">TX Packet</th>
                <td className="border p-4">
                  <div className="ml-4">{txPacket}</div>
                </td>
              </tr>

              <tr>
                <th className="w-80 border p-4">RX Byte</th>
                <td className="border p-4">
                  <div className="ml-4 flex">{rxByte}</div>
                </td>
              </tr>
              <tr>
                <th className="w-80 border p-4">TX Byte</th>
                <td className="border p-4">
                  <div className="ml-4 flex">{txByte}</div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">Last Disconnected Reason</th>
                <td className="border p-4">
                  <div className="ml-4">{lastDisconnect}</div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">Uptime</th>
                <td className="border p-4">
                  <div className="ml-4">{uptime}</div>
                </td>
              </tr>
              <tr>
                <th className="border p-4">Comment</th>
                <td className="border p-4">
                  <div className="ml-4">{comment}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
      <Card className="mt-8 h-full w-full pl-5 pr-5 pt-3 dark:bg-navy-700 dark:text-white">
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none dark:bg-navy-700 dark:text-white"
        >
          <div className="flex items-center justify-between gap-8">
            <div>
              <h1 className="text-xl font-bold" color="blue-gray">
                Statistical Graph
              </h1>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-5">
          <div className="mb-9 mt-3 flex justify-end">
            <RangePicker
              className="dark:white dark:bg-navy-700 dark:text-white"
              showTime
              onChange={onChangeRange}
            />
          </div>
          <div className="mt-5 dark:text-white">
            <h2>Usage Chart</h2>
            <div id="chart">
              <ReactApexChart
                options={areaLineOptions}
                series={areaLineOptions.series}
                type="area"
                height={500}
              />
            </div>
            <h2>Total Usage : {formatBytes(totalByte)}</h2>
          </div>
          <hr className="mb-5 mt-5" />
          <div className="mt-10">
            <h2>Packet Chart</h2>
            <div id="chart">
              <ReactApexChart
                options={areaLineOptionsPacket}
                series={areaLineOptionsPacket.series}
                type="area"
                height={500}
              />
            </div>
            <h2>Total Packet : {totalPacket}</h2>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default TableStatistic;
