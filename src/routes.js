import React from "react";
import MainDashboard from "views/admin/default";
import { FaBriefcase, FaBuilding, FaUsers } from "react-icons/fa";
import Companies from "views/admin/companies";
import Occupation from "views/admin/occupation";
import { MdHome, MdStarRate } from "react-icons/md";
import TopRated from "views/admin/topRated";
import Info from "views/admin/info";
import InfoHub from "views/admin/infohub";
import { BsGlobe, BsInfoCircleFill, BsQuestionCircle } from "react-icons/bs";
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
    name: "Users",
    layout: "/admin",
    path: "users",
    icon: <FaUsers className="h-6 w-6" />,
    component: <Companies />,
  },
  {
    name: "Installation",
    layout: "/admin",
    path: "installation",
    icon: <BsGlobe className="h-6 w-6" />,
    component: <Occupation />,
  },
  {
    name: "Complain",
    layout: "/admin",
    path: "complain",
    icon: <BsQuestionCircle className="h-6 w-6" />,
    component: <TopRated />,
  },
  // {
  //   name: "Info",
  //   layout: "/admin",
  //   path: "info",
  //   icon: <BsInfoCircleFill className="h-6 w-6" />,
  //   component: <Info />,
  // },
  // {
  //   name: "Info Hub",
  //   layout: "/admin",
  //   path: "hub",
  //   icon: <TiInfoLarge className="h-6 w-6" />,
  //   component: <InfoHub />,
  // },
];
export default routes;
