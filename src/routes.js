import React from "react";
import MainDashboard from "views/admin/default";
import { FaBriefcase, FaBuilding } from "react-icons/fa";
import Companies from "views/admin/companies";
import Occupation from "views/admin/occupation";
import { MdHome, MdStarRate } from "react-icons/md";
import TopRated from "views/admin/topRated";
import Info from "views/admin/info";
import InfoHub from "views/admin/infohub";
import { BsInfoCircleFill } from "react-icons/bs";
import { TiInfoLarge } from "react-icons/ti";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Companies",
    layout: "/admin",
    path: "companies",
    icon: <FaBuilding className="h-6 w-6" />,
    component: <Companies />,
  },
  {
    name: "Top Rated",
    layout: "/admin",
    path: "toprated",
    icon: <MdStarRate className="h-6 w-6" />,
    component: <TopRated />,
  },
  {
    name: "Occupation",
    layout: "/admin",
    path: "occupation",
    icon: <FaBriefcase className="h-6 w-6" />,
    component: <Occupation />,
  },
  {
    name: "Info",
    layout: "/admin",
    path: "info",
    icon: <BsInfoCircleFill className="h-6 w-6" />,
    component: <Info />,
  },
  {
    name: "Info Hub",
    layout: "/admin",
    path: "hub",
    icon: <TiInfoLarge className="h-6 w-6" />,
    component: <InfoHub />,
  },
];
export default routes;
