import { Transition } from "@headlessui/react";
import Card from "components/card";
import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { changePassword } from "api/company/profile";
import { toast } from "react-toastify";

const CompanyProfile = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem("email");
      const response = await changePassword({
        email: email,
        oldPassword: oldPassword,
        password: password,
        cPassword: confirmPassword,
      });

      console.log(response);
      setIsChangePasswordOpen(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Card extra={"w-full h-full p-4 sm:overflow-x-auto"}>
        <div className="my-2 flex flex-1 flex-col  items-center justify-center ">
          <p className="my-2">Click to Change password</p>
          <button
            className=" rounded-md bg-brand-500 px-4 py-2 text-white"
            onClick={() => setIsChangePasswordOpen(true)}
          >
            Change Password
          </button>
        </div>
      </Card>

      <Transition show={isChangePasswordOpen} as={React.Fragment}>
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
            </Transition.Child>

            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="z-50 inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                {/* Your modal content goes here */}
                <div className="bg-white px-2 pb-2 pt-2 sm:p-2 sm:pb-2">
                  <div className="">
                    {/* Modal Header */}
                    <div className="mt-3 whitespace-nowrap text-center sm:mt-0 sm:text-left">
                      <div className="flex w-full flex-row items-center justify-between">
                        <h3
                          className="ml-1 text-lg font-medium leading-6 text-gray-900 sm:ml-4"
                          id="modal-title"
                        >
                          Change Password
                        </h3>
                        <button
                          onClick={() => setIsChangePasswordOpen(false)}
                          type="button"
                          className=" text-3xl text-red-500"
                        >
                          <IoCloseCircle />
                        </button>
                      </div>
                      {/* Your other modal content */}
                      {/* Additional fields for password change */}
                      <div className="mx-1 mt-3 whitespace-nowrap text-center sm:mx-4 sm:mt-0 sm:text-left">
                        <div className="mt-4">
                          <label
                            htmlFor="oldPassword"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Old Password
                          </label>
                          <input
                            type="password"
                            id="oldPassword"
                            name="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none"
                          />
                        </div>
                        <div className="mt-4">
                          <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                          >
                            New Password
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none"
                          />
                        </div>
                        <div className="mt-4">
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className="border-transparent inline-flex w-full justify-center rounded-md border bg-brand-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default CompanyProfile;
