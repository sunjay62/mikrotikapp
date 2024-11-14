import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { BASE_URL_OLT } from "libs/auth-api";
import axiosInstance from "utils/axiosInstance";

export const useData = () => {
  const { deviceId } = useParams();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["data-vlans"],
    queryFn: async () => {
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

        const response = await axiosInstance.post(
          `${BASE_URL_OLT}/devices/vlan`,
          { id: deviceId },
          config
        );

        return response.data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
