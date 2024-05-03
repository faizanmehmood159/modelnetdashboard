/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import routes from "routes.js";
import logo from "../../assets/img/auth/logo.png";
const Sidebar = ({ open, onClose }) => {
 

  const currentRoutes =  routes;

  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${
        open ? "translate-x-0" : "-translate-x-96"
      }`}
    >
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[20px]  mb-[20px] flex items-center justify-center`}>
        <div className="mt-1 ml-1 flex h-3 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          <img src={logo} alt="logo" className="h-20 w-32" />
        </div>
      </div>
      <div className="mt-[50px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={currentRoutes} />
      </ul>

      {/* Nav item end */}
    </div>
  );
};

export default Sidebar;
