import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
import { motion, AnimatePresence } from "framer-motion";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { FaCircle } from "react-icons/fa";

export function SidebarLinks(props) {
  let location = useLocation();
  const navigate = useNavigate();
  const { routes } = props;
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const toggleSubMenu = (routeName) => {
    setExpandedMenu(expandedMenu === routeName ? null : routeName);
  };

  useEffect(() => {
    // Comment out this line to prevent the menu from closing on route change
    // setExpandedMenu(null);
  }, [location.pathname]);

  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.layout === "/admin" || route.layout === "/auth") {
        if (route.subRoutes) {
          return (
            <div
              key={index}
              className="mb-3"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="flex cursor-pointer items-center justify-between px-8 py-2 hover:text-gray-800"
                onClick={() => toggleSubMenu(route.name)}
              >
                <div className="mr-2 flex items-center">
                  <span
                    className={`${
                      expandedMenu === route.name
                        ? "text-brand-500 dark:text-white"
                        : hoveredIndex === index
                        ? "text-gray-800"
                        : "text-gray-600"
                    }`}
                  >
                    {route.icon}
                  </span>
                  <p
                    className={`ml-4 ${
                      expandedMenu === route.name
                        ? "font-semibold text-navy-700 dark:text-white"
                        : hoveredIndex === index
                        ? "font-medium text-gray-800"
                        : "font-medium text-gray-600"
                    }`}
                  >
                    {route.name}
                  </p>
                </div>
                <MdExpandMore
                  className={`transform text-2xl text-gray-700 transition-transform duration-300 dark:text-gray-400 ${
                    expandedMenu === route.name ? "rotate-180" : ""
                  }`}
                />
              </div>
              <AnimatePresence>
                {expandedMenu === route.name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-8"
                  >
                    {route.subRoutes.map((subRoute, subIndex) => (
                      <div
                        key={subIndex}
                        className="relative flex cursor-pointer items-center py-2 pl-4"
                        onClick={() => {
                          if (subRoute.onClick) {
                            subRoute.onClick();
                          } else if (route.layout && subRoute.path) {
                            navigate(route.layout + "/" + subRoute.path);
                          }
                        }}
                        onMouseEnter={() =>
                          setHoveredIndex(`${index}-${subIndex}`)
                        }
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <FaCircle
                          className={`mr-2 text-xs ${
                            activeRoute(subRoute.path)
                              ? "text-brand-500"
                              : hoveredIndex === `${index}-${subIndex}`
                              ? "text-gray-800"
                              : "text-gray-600"
                          }`}
                        />
                        <p
                          className={`${
                            activeRoute(subRoute.path)
                              ? "font-semibold text-navy-700 dark:text-white"
                              : hoveredIndex === `${index}-${subIndex}`
                              ? "font-medium text-gray-800"
                              : "font-medium text-gray-600"
                          } ml-2 cursor-pointer`}
                        >
                          {subRoute.name}
                        </p>
                        {activeRoute(subRoute.path) && (
                          <div className="absolute right-0 top-0 h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-500" />
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        } else {
          return (
            <Link
              key={index}
              to={route.layout + "/" + route.path}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative mb-3 flex hover:cursor-pointer">
                <li className="my-[3px] flex cursor-pointer items-center px-8">
                  <div className="mr-2 flex items-center">
                    <span
                      className={`${
                        activeRoute(route.path)
                          ? "font-semibold text-brand-500 dark:text-white"
                          : hoveredIndex === index
                          ? "font-medium text-gray-800"
                          : "font-medium text-gray-600"
                      }`}
                    >
                      {route.icon ? route.icon : <DashIcon />}
                    </span>
                    <p
                      className={`ml-4 ${
                        activeRoute(route.path)
                          ? "font-semibold text-navy-700 dark:text-white"
                          : hoveredIndex === index
                          ? "font-medium text-gray-800"
                          : "font-medium text-gray-600"
                      }`}
                    >
                      {route.name}
                    </p>
                  </div>
                </li>
                {activeRoute(route.path) && (
                  <div className="absolute right-0 top-px h-9 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
                )}
              </div>
            </Link>
          );
        }
      }
      return null;
    });
  };

  return createLinks(routes);
}

export default SidebarLinks;
