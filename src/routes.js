import React from "react";
import MainDashboard from "views/admin/default";
import { FaUsers } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { BsGlobe, BsQuestionCircle } from "react-icons/bs";
import ComplaintsMain from "views/admin/complaints/components";
import Installation from "views/admin/installation";
import Users from "views/admin/users";
import { HiSupport } from "react-icons/hi";
import Support from "views/admin/support";

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
    component: <Users />,
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
  {
    name: "Support",
    layout: "/admin",
    path: "support",
    icon: <HiSupport className="h-6 w-6" />,
    component: <Support />,
  },
  // {
  //   name: "Info Hub",
  //   layout: "/admin",
  //   path: "hub",
  //   icon: <TiInfoLarge className="h-6 w-6" />,
  //   component: <InfoHub />,
  // },
];
export default routes;
