import React from "react";
import MainDashboard from "views/admin/default";
import { FaUsers } from "react-icons/fa";
import Companies from "views/admin/companies";
import { MdHome } from "react-icons/md";
import { BsGlobe, BsQuestionCircle } from "react-icons/bs";
import ComplaintsMain from "views/admin/complaints/components";
import Installation from "views/admin/installation";

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
    component: <Installation />,
  },
  {
    name: "Complain",
    layout: "/admin",
    path: "complain",
    icon: <BsQuestionCircle className="h-6 w-6" />,
    component: <ComplaintsMain />,
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
