import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "libs/auth-api";
import axios from "axios";
import { toast } from "react-toastify";

export const useData = () => {
  const navigate = useNavigate();
  const { siteId } = useParams();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["data-secretsite"],
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

        const responseData = await axios.get(
          `${BASE_URL}/clientppp?site_id=${siteId}`,
          config
        );

        return responseData.data.data;
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
                    refreshError.response.status === 401
                  ) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    navigate("/login");
                    toast.error("Your session is expired, please login again.");
                  } else if (
                    refreshError.response &&
                    refreshError.response.status === 422
                  ) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    navigate("/login");
                    toast.error("Your session is expired, please login again.");
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
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
