import React, { useState } from "react";
import { Button, Card, CardHeader, CardBody } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "libs/auth-api";
import axiosInstance from "utils/axiosInstance";
import LoadingTable from "components/loading";

const OnuStatus = () => {
  const { deviceId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [rawStatus, setRawStatus] = useState(null);

  const fetchDataStatus = async () => {
    setIsLoading(true);
    setRawStatus(null);

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

      const startTime = Date.now();

      const responseData = await axiosInstance.post(
        `${BASE_URL}/olt/onu/configured/info/status_raw`,
        formData,
        config
      );

      const endTime = Date.now();
      const elapsedTime = endTime - startTime;
      const minimumLoadingTime = 1000; // 1 second in milliseconds

      if (elapsedTime < minimumLoadingTime) {
        // If the request was faster than 1 second, wait for the remaining time
        await new Promise((resolve) =>
          setTimeout(resolve, minimumLoadingTime - elapsedTime)
        );
      }

      setRawStatus(responseData.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full w-full rounded-none dark:bg-navy-700 dark:text-white">
      <CardHeader
        floated={false}
        shadow={false}
        className="rounded-none dark:bg-navy-700 dark:text-white"
      >
        <Button
          className="bg-blue-500 transition-all hover:bg-blue-600"
          onClick={fetchDataStatus}
          disabled={isLoading}
        >
          Get Status
        </Button>
      </CardHeader>
      <CardBody className="px-0">
        {isLoading ? (
          <p className="text-center">
            <LoadingTable />
          </p>
        ) : rawStatus ? (
          <div className="rounded-lg bg-gray-100 p-4">
            <pre className="font-mono whitespace-pre-wrap break-words text-xs">
              {rawStatus}
            </pre>
          </div>
        ) : (
          <span></span>
        )}
      </CardBody>
    </Card>
  );
};

export default OnuStatus;
