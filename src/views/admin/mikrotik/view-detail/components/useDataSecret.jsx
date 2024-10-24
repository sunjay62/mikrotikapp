import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "libs/auth-api";

export const useData = (mikrotikId) => {
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["data-secret-detail", mikrotikId],
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

        const response = await axios.get(
          `${BASE_URL}/mikrotik/${mikrotikId}/pppsecrets`,
          config
        );

        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (error.response.status === 401) {
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
                  refetch();
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
                    toast.error(
                      "Your session has expired, please login again."
                    );
                  }
                }
              }
            } else if (error.response.status === 404) {
              return [];
            }
          }
        }

        throw error;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
