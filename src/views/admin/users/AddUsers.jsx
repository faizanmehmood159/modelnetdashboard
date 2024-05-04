import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import Card from "components/card";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addUser } from "api/admin/users";

const AddUsers = () => {
  const navigate = useNavigate();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone_no: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const isValidEmail = (emailTest) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailTest);
  };
  const isValidPhoneNumber = (phoneNo) => {
    const phoneNoRegex = /^(\+92|0|92)[0-9]{10}$/;
    return phoneNoRegex.test(phoneNo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setAddLoading(true);
      if (!userData.name) {
        setErrors({
          ...errors,
          name: "Please Enter Name",
        });
        return;
      }
      if (!userData.email) {
        setErrors({
          ...errors,
          email: "Please Enter email",
        });
        return;
      } else if (!isValidEmail(userData.email)) {
        setErrors({
          ...errors,
          email: "Please enter valid email",
        });
        return;
      }
      if (!userData.phone_no) {
        setErrors({
          ...errors,
          phone_no: "Please Enter Phone Number",
        });
        return;
      } else if (!isValidPhoneNumber(userData.phone_no)) {
        setErrors({
          ...errors,
          phone_no: "Please enter a valid phone number in the format +92XXXXXXXXXX",
        });
        return;
      }
      if (!userData.password) {
        setErrors({
          ...errors,
          password: "Please Enter password",
        });
        return;
      }
      if (userData.password.length < 8) {
        setErrors({
          ...errors,
          password: "Password must be at least 8 characters long.",
        });
        return;
      } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/g.test(
          userData.password
        )
      ) {
        setErrors({
          ...errors,
          password:
            "Password must be a combination of letters (at least 1 uppercase & 1 lowercase), digits, & special characters.",
        });
        return;
      }
      const data = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone_no: userData.phone_no,
      };
console.log(data)
      const response = await addUser(data);
      console.log(response.status);
      if (response.status === 200) {
        toast.success("User Added Successfully");
        setAddLoading(false);
        setIsAddUserOpen(false);
        setUserData({});
        setErrors({});
        navigate("/admin/default");
      }
    } catch (error) {
      console.error(error.response.data.message);
      if(error.response.data.message === "User already exists"){
        setErrors({
          ...errors,
          general: error.response.data.message,
        });
      } else {
      setErrors({
        ...errors,
        general: "An error occurred while adding the user",
      });
    }
    
    } finally {
      setAddLoading(false);
    }
  };

  const handleClose = () => {
    setIsAddUserOpen(false);
    setErrors({});
    setUserData({});
  };

  return (
    <>
      <Card extra={"w-full h-full mt-6 mb-4 p-4 sm:overflow-x-auto"}>
        <div>
          <div className="flex flex-row items-center justify-between">
            <div></div>
            <button
              className="m-4 rounded-md bg-brand-500 px-4 py-2 text-white"
              onClick={() => setIsAddUserOpen(true)}
            >
              Add User
            </button>
          </div>
        </div>
      </Card>
      {/* Add User */}
      <Transition show={isAddUserOpen} as={React.Fragment}>
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

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
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
                <>
                  {addLoading ? (
                    <div className="my-20 flex h-full items-center justify-center">
                      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between">
                          <h1
                            className="text-lg font-medium leading-6 text-gray-900"
                            id="modal-title"
                          >
                            Add User
                          </h1>
                          <button
                            onClick={handleClose}
                            className="rounded-full bg-red-500 text-white hover:bg-red-600 focus:border-yellow-300 focus:outline-none focus:ring"
                          >
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                        {errors.general && (
                          <div className="my-3 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
                            {errors.general}
                          </div>
                        )}
                        <div className="mt-5 space-y-6">
                          <div className="sm:flex sm:space-x-4">
                            <div className="mb-2 sm:w-1/2">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Full Name
                              </label>
                              <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="given-name"
                                value={userData.name}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                  errors.name ? "border-red-500" : ""
                                }`}
                              />
                              {errors.name && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.name}
                                </p>
                              )}
                            </div>
                            <div className="mb-2 sm:w-1/2">
                              <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Email address
                              </label>
                              <input
                                id="email"
                                name="email"
                                type="text"
                                autoComplete="email"
                                value={userData.email}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                  errors.email ? "border-red-500" : ""
                                }`}
                              />
                              {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.email}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="sm:flex sm:space-x-4">
                            <div className="mb-2 sm:w-1/2">
                              <label
                                htmlFor="phone_no"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Phone No.
                              </label>
                              <input
                                id="phone_no"
                                name="phone_no"
                                type="number"
                                autoComplete="phone_no"
                                value={userData.phone_no}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                  errors.phone_no ? "border-red-500" : ""
                                }`}
                              />
                              {errors.phone_no && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.phone_no}
                                </p>
                              )}
                            </div>
                            <div className="mb-2 sm:w-1/2">
                              <label
                                htmlFor="password"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Password
                              </label>
                              <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={userData.password}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                  errors.password ? "border-red-500" : ""
                                }`}
                              />
                              {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.password}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-center">
                            <button
                              onClick={handleSubmit}
                              className="border-transparent inline-flex justify-center rounded-md border bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Add User
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default AddUsers;
