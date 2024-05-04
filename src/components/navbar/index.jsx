import React, { useState, useEffect } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = (props) => {
  const navigate = useNavigate();
  const avatar =
    "https://gravatar.com/avatar/890f940dd9ba3a41bf63dcb1f1e1300d?s=400&d=mp&r=x";
  const { onOpenSidenav, brandText } = props;
  const [adminType, setAdminType] = useState("");
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwttoken");
    const admintype = localStorage.getItem("adminType");
    setAdminType(admintype);

    if (jwtToken === "") {
      navigate("/auth/login");
    }
  }, [navigate]);


  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("login");
    navigate("/auth/login");
    toast.success("Logged out Successfully.");
  };

  const profileLink =
    adminType === "company" || adminType === "companyUser"
      ? "/company/profile"
      : adminType === "admin"
      ? "/admin/profile"
      : "";

  return (
    <nav className="sticky top-4 z-10 shadow-md flex flex-row flex-wrap items-center justify-between rounded-xl bg-white p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="rounded-ful relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-end gap-2 px-2 py-2  dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>
        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="h-10 w-10 rounded-full"
              src={avatar}
              alt="Elon Musk"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey Admin
                  </p>{" "}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                {/* {adminType !== "admin" &&(
                <Link
                  to={profileLink}
                  className="text-sm text-gray-800 dark:text-white hover:dark:text-white"
                >
                  Profile Settings
                </Link>
                )} */}
                <button
                  onClick={handleLogout}
                  className="mt-0 text-left text-sm font-medium text-red-500 hover:text-red-500"
                > 
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;
