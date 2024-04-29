import React from "react";
import {
  BsCalendar2,
  BsCalendar2CheckFill,
  BsInfoCircle,
} from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { IoBriefcase } from "react-icons/io5";
import { MdHome, MdPerson, MdRateReview } from "react-icons/md";
import Appointments from "views/company/appointments";
import CompanyDashboard from "views/company/dashboard";
import Details from "views/company/details";
import Finished from "views/company/finished";
import Jobs from "views/company/jobs";
import Profile from "views/company/profile";
import Reviews from "views/company/reviews";
import Users from "views/company/users";

const companyRoutes = [
  {
    name: "Dashboard",
    layout: "/company",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <CompanyDashboard />,
  },
  {
    name: "Users",
    layout: "/company",
    path: "users",
    icon: <FaUsers className="h-6 w-6" />,
    component: <Users />,
  },
  {
    name: "Company Details",
    layout: "/company",
    path: "companyDetails",
    icon: <BsInfoCircle className="h-6 w-6" />,
    component: <Details />,
  },
  {
    name: "Jobs",
    layout: "/company",
    path: "jobs",
    icon: <IoBriefcase className="h-6 w-6" />,
    component: <Jobs />,
  },
  {
    name: "Appointments",
    layout: "/company",
    path: "appointments",
    icon: <BsCalendar2 className="h-6 w-6" />,
    component: <Appointments />,
  },
  {
    name: "Reviews",
    layout: "/company",
    path: "reviews",
    icon: <MdRateReview className="h-6 w-6" />,
    component: <Reviews />,
  },
  {
    name: "Finished Appointments",
    layout: "/company",
    path: "finished",
    icon: <BsCalendar2CheckFill className="h-6 w-6" />,
    component: <Finished />,
  },
  {
    name: "Profile",
    layout: "/company",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
];
export default companyRoutes;
