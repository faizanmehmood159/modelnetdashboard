import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
export function SidebarLinks(props) {
  let location = useLocation();
  const { routes } = props;
  const [adminType, setAdminType] = useState("");
  useEffect(() => {
    const storedAdminType = localStorage.getItem("adminType") || "";
    setAdminType(storedAdminType);
  }, []);
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };
  const shouldShowItem = (route) => {
    return !(
      adminType === "companyUser" &&
      (route.path === "users" ||
        route.path === "companyDetails" ||
        route.path === "dashboard")
    );
  };
  const createLinks = (filteredRoutes) => {
    return filteredRoutes.map((route, index) => (
      <Link key={index} to={route.layout + "/" + route.path}>
        <div
          className={`${
            activeRoute(route.path) === true
              ? " relative my-2 flex bg-brand-100 py-2 font-bold text-brand-500 hover:cursor-pointer dark:text-white"
              : " relative my-2 flex  py-2 font-medium text-gray-600 hover:cursor-pointer"
          }`}
        >
          <li
            className="my-[3px] flex cursor-pointer items-center px-8"
            key={index}
          >
            <span
              className={`${
                activeRoute(route.path) === true
                  ? "font-bold text-brand-500 dark:text-white"
                  : "font-medium text-gray-600"
              }`}
            >
              {route.icon ? route.icon : <DashIcon />}{" "}
            </span>
            <p
              className={`leading-1 ml-4 flex ${
                activeRoute(route.path) === true
                  ? "font-bold text-brand-500 dark:text-white"
                  : "font-medium text-gray-600"
              }`}
            >
              {route.name}
            </p>
          </li>
          {activeRoute(route.path) ? (
            <div className="absolute left-0 top-px h-full w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
          ) : null}
        </div>
      </Link>
    ));
  };

  const filteredRoutes = routes.filter(shouldShowItem);

  return createLinks(filteredRoutes);
}
export default SidebarLinks;
