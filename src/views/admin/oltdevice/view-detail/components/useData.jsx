import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BASE_URL_OLT } from "libs/auth-api";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "utils/axiosInstance";

export const useData = () => {
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["data-olt-device"],
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

        const responseData = await axiosInstance.get(
          `${BASE_URL_OLT}/devices`,
          config
        );

        return responseData.data;
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
