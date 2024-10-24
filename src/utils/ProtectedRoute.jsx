import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "libs/auth-api";
import useAuthStore from "./useAuthStore";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const matchPath = (pattern, path) => {
  const escapedPattern = pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regexPattern = escapedPattern.replace(/:[^\s/]+/g, "[^/]+");
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
};

const ProtectedRoute = ({ element, restrictedRoutes = [] }) => {
  const { token, rToken, setToken, role } = useAuthStore(); // Assuming role is available in useAuthStore
  const [decodedRole, setDecodedRole] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setDecodedRole(decoded.role); // Store the decoded role
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/token/@verify?type=access`,
          {
            token: token,
          }
        );

        if (response.data.status === "expired") {
          const refreshResponse = await axios.post(
            `${BASE_URL}/userlogin/@refresh_token`,
            {
              refresh_token: rToken,
            }
          );

          if (refreshResponse.data && refreshResponse.data.access_token) {
            localStorage.setItem(
              "access_token",
              refreshResponse.data.access_token
            );
            setToken(refreshResponse.data.access_token);
          } else {
            localStorage.removeItem("access_token");
            setToken(null);
            toast.error("Your session is expired, please login again.");
          }
        }
      } catch (error) {
        localStorage.removeItem("access_token");
        setToken(null);
        if (error.response && error.response.status === 400) {
          return <Navigate to="/login" />;
        }
      }
    };

    if (token) {
      checkTokenValidity();
    }
  }, [token, rToken, setToken]);

  // Check if the current path is restricted for 'teknisi' role
  const currentPath = window.location.pathname;
  if (
    decodedRole === "teknisi" &&
    (matchPath("/admin/mikrotikkk", currentPath) ||
      matchPath("/admin/profileee", currentPath))
  ) {
    return <Navigate to="/admin/home" />;
  }

  return token ? (
    element
  ) : (
    <Navigate to="/login" state={{ error: "Not Authorized, Please Login!" }} />
  );
};

export default ProtectedRoute;
