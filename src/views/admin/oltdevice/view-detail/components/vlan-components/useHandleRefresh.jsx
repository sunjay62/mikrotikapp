import { useEffect } from "react";
import axiosInstance from "utils/axiosInstance";
import { BASE_URL_OLT } from "libs/auth-api";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useData } from "./useData";

const useHandleRefresh = () => {
  const { deviceId } = useParams();
  const { refetch } = useData();

  useEffect(() => {
    const handleRefresh = async () => {
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

        const formData = {
          id: deviceId,
        };

        const responseData = await toast.promise(
          axiosInstance.post(
            `${BASE_URL_OLT}/devices/vlan/sync`,
            formData,
            config
          ),
          {
            pending: "Synchronizing ...",
            success: "Synchronize Success!",
          }
        );

        if (responseData.status === 200) {
          refetch();
        }
      } catch (error) {
        console.log(error);
      }
    };

    handleRefresh();
  }, [deviceId, refetch]);
};

export default useHandleRefresh;
