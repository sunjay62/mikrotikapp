import React, { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import routes from "routes.js";
import { jwtDecode } from "jwt-decode";

const Sidebar = ({ open, onClose }) => {
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setDecodedToken(decoded);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  // Filter routes to exclude certain routes based on role
  const filteredRoutes = routes.filter((route) => {
    // Exclude specific routes
    const excludeRoutes = [
      "View Mikrotik",
      "Mikrotik Profile Detail",
      "Sites Profile Detail",
      "View Site",
      "View Device",
      "Speed Profile",
      "Onu Type",
      "OLT Master",
      "OLT Device",
      "ONT Device",
    ];
    if (excludeRoutes.includes(route.name)) {
      return false;
    }

    // Additional filter based on role
    if (decodedToken) {
      if (decodedToken.role === "teknisi") {
        // Exclude "MikroTikkk" and "Profile" routes for "teknisi" role
        return route.name !== "MikroTikkk" && route.name !== "Profile";
      }

      if (decodedToken.role === "admin") {
        // Exclude "Smart OLT" route for "admin" role
        return route.name !== "Smart OLT";
      }
    }

    return true;
  });

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute right-4 top-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[35px] mt-[30px] flex items-center`}>
        <div className="ml-1 mt-1 h-2.5  font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          MikroTik Apps
        </div>
      </div>
      <div className="mb-7 mt-16 h-px   bg-gray-300 dark:bg-white/30" />
      <div className="scrollbar-hide mb-auto max-h-[calc(100vh-150px)] overflow-y-auto">
        <ul className="mb-auto pt-1">
          {/* Render Links component with filtered routes */}
          <Links routes={filteredRoutes} />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
