import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { signUp } from "api/company/auth";
import { MdFileUpload } from "react-icons/md";
import Card from "components/card";
import { toast } from "react-toastify";
import {
  getCompanyUsers,
  deleteCompanyUsers,
  updateCompanyUsers,
} from "api/company/users";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaEllipsisH, FaTrash } from "react-icons/fa";

const AddUser = () => {
  const navigate = useNavigate();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [id, setId] = useState(null);
  const [selectedEditUserId, setSelectedEditUserId] = useState(null);

  const [showDropdown, setShowDropdown] = useState([]);
  const handleEllipsisClick = (index) => {
    const updatedDropdownState = [...showDropdown];
    updatedDropdownState[index] = !updatedDropdownState[index];
    setShowDropdown(updatedDropdownState);
  };

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyImage: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCompanyUsers = async () => {
      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("jwttoken");
        const response = await getCompanyUsers(id, token);
        setData(response.data.data);
        console.log(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);

        console.error("Error fetching company users:", error);
      }
    };

    fetchCompanyUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setUserData({
      ...userData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleImageChange = (e) => {
    const file =
      e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;

    if (file) {
      const fileType = file.type;
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setUserData({
          ...userData,
          companyImage: base64Image,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const isValidEmail = (emailTest) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailTest);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const companyId = localStorage.getItem("id");

    try {
      if (!userData.firstName) {
        setErrors({
          ...errors,
          firstName: "Please Enter First Name",
        });
        return;
      }
      if (!userData.lastName) {
        setErrors({
          ...errors,
          lastName: "Please Enter Last Name",
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
      if (userData.password !== userData.confirmPassword) {
        setErrors({
          ...errors,
          confirmPassword: "Passwords do not match",
        });
        return;
      }
      setAddLoading(true);
      const formData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        cPassword: userData.confirmPassword,
        companyId: companyId,
        adminType: "companyUser",
        companyImage: userData.companyImage,
      };

      const response = await signUp(formData);
      if (response.data.status === 200) {
        console.log(response);
        toast.success(response.data.message);
        setAddLoading(false);
        navigate("/company/dashboard");
      }
      setIsAddUserOpen(false);

      setUserData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyImage: null,
      });

      setErrors({});
    } catch (error) {
      console.error(error);
      setErrors({
        ...errors,
        general: "An error occurred while adding the user",
      });
    } finally {
      setAddLoading(false);
    }
  };

  const handleClose = () => {
    setIsAddUserOpen(false);
    setErrors({});
    setUserData({});
  };

  const openDeleteModal = (userId) => {
    setId(userId);
    setIsDeleteUserOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteUserOpen(false);
  };

  const onDelete = async () => {
    const token = localStorage.getItem("jwttoken");

    console.log(id);

    try {
      setDeleteLoading(true);
      const response = await deleteCompanyUsers(id, token);
      if (response.data.status === 200) {
        toast.success("Company user deleted successfully.");
        navigate("/company/dashboard");
        setDeleteLoading(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
    closeDeleteModal();
  };

  const closeEditModal = () => {
    setIsEditUserOpen(false);
    setUserData({});
  };

  const handleEditClick = (item) => {
    setSelectedEditUserId(item._id);
    setUserData(item);
    setIsEditUserOpen(true);
    console.log(item);
  };

  const handleUpdateSubmit = async () => {
    try {
      setUpdateLoading(true);
      const body = {
        id: selectedEditUserId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        companyImage: userData.companyImage,
      };

      const response = await updateCompanyUsers(body);
      if (response.data.status === 200) {
        toast.success("User Updated Successfully.");
        navigate("/company/dashboard");
        setUpdateLoading(false);
        setUserData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          companyImage: null,
        });
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error editing occupation:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <>
      <Card extra={"w-full h-full my-6 p-4 sm:overflow-x-auto"}>
        <div>
          <div className="flex flex-row items-center justify-between">
            <div></div>
            <button
              className="m-4 rounded-md bg-brand-50 px-4 py-2 text-white"
              onClick={() => setIsAddUserOpen(true)}
            >
              Add User
            </button>
          </div>

          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
            </div>
          ) : (
            <div className="mt-8 h-full overflow-x-scroll xl:overflow-hidden">
              <div className="max-h-[80vh] overflow-y-auto">
                <table className="w-full whitespace-nowrap text-center">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                        #
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                        Photo
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                        Name
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                        Email
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                        Create At
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item._id}>
                        <td className="pb-4 pt-4 sm:text-base">
                          <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                            <li className="m-2 w-full rounded p-2 shadow-md">
                              {index + 1}
                            </li>
                          </ul>
                        </td>
                        <td className="pb-4 pt-4 sm:text-base">
                          <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                            <li className="m-2 h-14 w-14 shadow-md">
                              <img
                                className=""
                                src={
                                  item?.companyImage ||
                                  "https://placehold.co/200x200/png"
                                }
                                alt="Logo"
                              />
                            </li>
                          </ul>
                        </td>

                        <td className="pb-4 pt-4 sm:text-base">
                          <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                            <li className="m-2 w-full rounded p-2 shadow-md">
                              {item?.firstName} {item?.lastName}
                            </li>
                          </ul>
                        </td>
                        <td className="pb-4 pt-4 sm:text-base">
                          <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                            <li className="m-2 w-full rounded  p-2 shadow-md">
                              {item?.email}
                            </li>
                          </ul>
                        </td>
                        <td className="pb-4 pt-4 sm:text-base">
                          <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                            <li className="m-2 w-full rounded p-2 shadow-md">
                              {item?.createdAt && (
                                <span>
                                  {new Date(item.createdAt).toLocaleString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                      timeZone: "UTC",
                                    }
                                  )}
                                </span>
                              )}{" "}
                            </li>
                          </ul>
                        </td>
                        <td className="pb-[18px] pt-[14px] sm:text-[14px]">
                          <div className="relative inline-block text-left">
                            <button
                              className="rounded bg-brand-50 px-4 py-2 text-white hover:bg-brand-500"
                              onClick={() => handleEllipsisClick(index)}
                            >
                              <FaEllipsisH />
                            </button>

                            {showDropdown[index] && (
                              <div className="my-1">
                                <div className="ring-black animate-fade-in  absolute right-0 mt-0 flex origin-top-right rounded-md  shadow-lg ring-opacity-5">
                                  <button
                                    onClick={() => handleEditClick(item)}
                                    className="block px-4 py-2 text-blue-700 hover:bg-gray-200"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(item._id)}
                                    className="block px-4 py-2 text-red-700 hover:bg-gray-200"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Card>
      {/* ADD user */}
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
                      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
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
                        <form
                          className="mt-5 space-y-6"
                          onSubmit={handleSubmit}
                        >
                          <div className="sm:flex sm:space-x-4">
                            <div className="mb-2 sm:w-1/2">
                              <label
                                htmlFor="firstName"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                First Name
                              </label>
                              <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                value={userData.firstName}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                  errors.firstName ? "border-red-500" : ""
                                }`}
                              />
                              {errors.firstName && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.firstName}
                                </p>
                              )}
                            </div>

                            <div className="mb-2 sm:w-1/2">
                              <label
                                htmlFor="lastName"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Last Name
                              </label>
                              <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                value={userData.lastName}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                  errors.lastName ? "border-red-500" : ""
                                }`}
                              />
                              {errors.lastName && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.lastName}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mb-2">
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
                          <div className="sm:flex sm:space-x-4">
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
                            <div className="mb-2 sm:w-1/2">
                              <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Confirm Password
                              </label>
                              <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                value={userData.confirmPassword}
                                onChange={handleChange}
                                className={`mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                  errors.confirmPassword ? "border-red-500" : ""
                                }`}
                              />
                              {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                  {errors.confirmPassword}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
                            <div className="relative mb-2 rounded-lg border border-dashed border-gray-300 p-4 text-center">
                              <label
                                htmlFor="companyImage"
                                className="block text-sm font-medium text-gray-600"
                              >
                                <MdFileUpload className="mx-auto mb-2 text-[80px] text-brand-50 dark:text-white" />
                                Click to upload User Image
                                <input
                                  className="hidden"
                                  id="companyImage"
                                  name="companyImage"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                />
                              </label>
                            </div>
                            <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300">
                              <img
                                className="h-[14vh] w-auto"
                                src={userData?.companyImage}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-center">
                            <button
                              type="submit"
                              className="border-transparent inline-flex justify-center rounded-md border bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Add User
                            </button>
                          </div>
                        </form>
                      </div>
                    </>
                  )}
                </>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>

      {/* DELETE User Modal */}
      <Transition show={isDeleteUserOpen} as={React.Fragment}>
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
              <div className="z-50 inline-block transform overflow-hidden rounded-lg bg-white text-center align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                {deleteLoading ? (
                  <div className="my-20 flex h-full items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="">
                        <div className="mt-3 text-center sm:mt-0 sm:text-center">
                          <h1
                            className="text-center text-3xl font-medium leading-6 text-gray-900"
                            id="modal-title"
                          >
                            ⚠️
                          </h1>
                          <p className="mt-3 text-sm text-gray-500">
                            Are you sure you want to delete this User?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="justify-center px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        onClick={onDelete}
                        type="button"
                        className="border-transparent mx-2 inline-flex w-full justify-center rounded-md border bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={closeDeleteModal}
                        type="button"
                        className="border-transparent mx-2 mt-2 inline-flex w-full justify-center rounded-md border bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>

      {/* Update User Modal */}
      <Transition show={isEditUserOpen} as={React.Fragment}>
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
                {updateLoading ? (
                  <div className="my-20 flex h-full items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white px-2 pt-3">
                      <div className="">
                        {/* Modal Header */}
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                          <div className="flex items-center justify-between">
                            <h1
                              className="text-lg font-medium leading-6 text-gray-900"
                              id="modal-title"
                            >
                              Edit User
                            </h1>
                            <button
                              onClick={closeEditModal}
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
                                  htmlFor="firstName"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  First Name
                                </label>
                                <input
                                  id="firstName"
                                  name="firstName"
                                  type="text"
                                  autoComplete="given-name"
                                  value={userData.firstName}
                                  onChange={handleChange}
                                  className={`mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                    errors.firstName ? "border-red-500" : ""
                                  }`}
                                />
                                {errors.firstName && (
                                  <p className="mt-1 text-sm text-red-500">
                                    {errors.firstName}
                                  </p>
                                )}
                              </div>

                              <div className="mb-2 sm:w-1/2">
                                <label
                                  htmlFor="lastName"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Last Name
                                </label>
                                <input
                                  id="lastName"
                                  name="lastName"
                                  type="text"
                                  autoComplete="family-name"
                                  value={userData.lastName}
                                  onChange={handleChange}
                                  className={`mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                                    errors.lastName ? "border-red-500" : ""
                                  }`}
                                />
                                {errors.lastName && (
                                  <p className="mt-1 text-sm text-red-500">
                                    {errors.lastName}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="mb-2">
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
                            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
                              <div className="relative mb-2 rounded-lg border border-dashed border-gray-300 p-4 text-center">
                                <label
                                  htmlFor="companyImage"
                                  className="block text-sm font-medium text-gray-600"
                                >
                                  <MdFileUpload className="mx-auto mb-2 text-[80px] text-brand-50 dark:text-white" />
                                  Click to upload User Image
                                  <input
                                    className="hidden"
                                    id="companyImage"
                                    name="companyImage"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                  />
                                </label>
                              </div>
                              <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300">
                                <img
                                  className="h-[14vh] w-auto"
                                  src={userData?.companyImage}
                                  alt="uploaded img"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-center">
                              <button
                                onClick={handleUpdateSubmit}
                                className="border-transparent inline-flex justify-center rounded-md border bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                Edit User
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default AddUser;
