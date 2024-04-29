import React, { useState } from "react";
import Card from "components/card";
import { FaEdit, FaEllipsisH, FaEye, FaTrash } from "react-icons/fa";
import { Transition } from "@headlessui/react";
import { IoCloseCircle } from "react-icons/io5";
import avatar from "../../../assets/img/avatars/avatar10.png";
import banner from "../../../assets/img/profile/banner.png";
const CompaniesTable = () => {
  const [step, setStep] = useState(1);

  const totalSteps = 5;

  const steps = [
    {
      id: "Step 1",
      name: "Basic Information",
      status: step >= 1 ? "complete" : "upcoming",
    },
    {
      id: "Step 2",
      name: "Social Details",
      status: step >= 2 ? "complete" : "upcoming",
    },
    {
      id: "Step 3",
      name: "Select Package",
      status: step >= 3 ? "complete" : "upcoming",
    },
    {
      id: "Step 4",
      name: "Select Payment Method",
      status: step >= 4 ? "complete" : "upcoming",
    },
  ];
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const handleEllipsisClick = () => {
    setShowDropdown(!showDropdown);
  };
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [isDeleteCopmanyOpen, setIsDeleteCompanyOpen] = useState(false);
  const [isViewCopmanyOpen, setIsViewCompanyOpen] = useState(false);

  const openDeleteModal = () => {
    setIsDeleteCompanyOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteCompanyOpen(false);
  };

  const onDelete = () => {
    console.log("Item deleted!");
    closeDeleteModal();
  };

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const categories = ["Category 1", "Category 2", "Category 3"];
  const subcategories = {
    "Category 1": ["Subcategory 1.1", "Subcategory 1.2"],
    "Category 2": ["Subcategory 2.1", "Subcategory 2.2"],
    "Category 3": ["Subcategory 3.1", "Subcategory 3.2"],
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setSelectedSubcategory("");
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
  };

  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    companyName: "",
    companyDescription: "",
    topRated: false,
    facebook: "",
    twitter: "",
    instagram: "",
    linkedIn: "",
    image: "",
    video: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            {/* Step 1 content */}
            {/* Categories select */}
            <div>
              <div className="flex w-full flex-row items-center">
                <div className="mt-2 w-full px-2 sm:w-1/2">
                  <label className="mb-2 block text-sm font-bold">
                    Category
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory && (
                  <div className="mt-2 w-full px-2 sm:w-1/2">
                    <label className="mb-2 block text-sm font-bold">
                      Subcategory
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 p-2"
                      value={selectedSubcategory}
                      onChange={handleSubcategoryChange}
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories[selectedCategory].map((subcategory) => (
                        <option key={subcategory} value={subcategory}>
                          {subcategory}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              {/* company Name */}
              <div className="flex w-full flex-row items-center">
                <div className="mt-2 w-full px-2 sm:w-1/2">
                  <label className="mb-2 block text-sm font-bold">
                    Company Name
                  </label>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="company name..."
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>

                <div className="mt-2 w-full px-2 sm:w-1/2"></div>
              </div>
              {/* company Description */}
              <div className="flex w-full flex-row items-center">
                <div className="mt-2 w-full px-2 sm:w-1/2">
                  <label className="mb-2 block text-sm font-bold">
                    Company Description
                  </label>
                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleInputChange}
                    placeholder="company description..."
                    className="w-full rounded-md border border-gray-300 p-2"
                  />
                </div>

                <div className="mt-2 w-full px-2 sm:w-1/2"></div>
              </div>
            </div>

            <div className="mt-4 flex w-full flex-row justify-end">
              <button
                className=" mx-2 w-full rounded-md bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  nextStep();
                }}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            {/* Step 2 content */}
            {/* is top rated */}
            {/* <div className="mt-4 flex w-full flex-row items-center">
              <input
                className="mx-2 h-4 w-4"
                type="checkbox"
                name="topRated"
                onChange={handleInputChange}
                checked={formData.topRated}
              />
              <label>Top Rated</label>
            </div> */}

            {/* Social Media Links */}
            <div>
              {/* facebook and twitter url Links */}
              <div className="flex w-full flex-row items-center">
                <div className="mt-2 w-full px-2 sm:w-1/2">
                  <label className="mb-2 block text-sm font-bold">
                    Facebook
                  </label>
                  <input
                    name="facebook"
                    placeholder="facebook url"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={formData.facebook}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mt-2 w-full px-2 sm:w-1/2">
                  <label className="mb-2 block text-sm font-bold">
                    Twitter
                  </label>
                  <input
                    name="twitter"
                    placeholder="twitter url"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={formData.twitter}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* instagram and linkedin url Links */}
              <div className="flex w-full flex-row items-center">
                <div className="mt-2 w-full px-2 sm:w-1/2">
                  <label className="mb-2 block text-sm font-bold">
                    Instagram
                  </label>
                  <input
                    name="instagram"
                    placeholder="instagram url"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={formData.instagram}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mt-2 w-full px-2 sm:w-1/2">
                  <label className="mb-2 block text-sm font-bold">
                    LinkedIn
                  </label>
                  <input
                    name="linkedIn"
                    placeholder="linkedIn url"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={formData.linkedIn}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex w-full flex-row justify-end">
              <button
                className=" mx-2 w-full rounded-md bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  prevStep();
                }}
              >
                Previous
              </button>
              <button
                className=" mx-2 w-full rounded-md bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  nextStep();
                }}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div>
              {/* Image and Video url Links */}
              <div className="flex w-full flex-row items-center">
                <div className="mt-2 w-full px-2 sm:w-1/2">
                  <label className="mb-2 block text-sm font-bold">Image</label>
                  <input
                    name="image"
                    placeholder="image url"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mt-2 w-full px-2 sm:w-1/2">
                  <label className="mb-2 block text-sm font-bold">Video</label>
                  <input
                    name="video"
                    placeholder="video url"
                    className="w-full rounded-md border border-gray-300 p-2"
                    value={formData.video}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            {/* Step 3 content */}
            <div className="mt-4 flex w-full flex-row justify-end">
              <button
                className=" mx-2 w-full rounded-md bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  prevStep();
                }}
              >
                Previous
              </button>
              <button
                className=" mx-2 w-full rounded-md bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  nextStep();
                }}
              >
                Next
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="mt-4 flex w-full flex-row justify-end">
              <button
                className=" mx-2 w-full rounded-md bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  prevStep();
                }}
              >
                Previous
              </button>
              <button
                className=" mx-2 w-full rounded-md bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Submit
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card extra={"w-full h-full my-4 p-4 sm:overflow-x-auto"}>
        <div className="relative flex justify-between">
          <div className="text-xl font-bold text-navy-700 dark:text-white"></div>
          <button
            onClick={() => setIsAddCompanyOpen(true)}
            className="mr-4 mt-4 rounded-md bg-brand-500 px-4 py-2 text-white"
          >
            Add Company
          </button>
        </div>

        <div className="mt-8 h-full overflow-x-scroll xl:overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-center">
              <thead>
                <tr>
                  <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                    Column 1
                  </th>
                  <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                    Actions
                  </th>
                  <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                    Actions
                  </th>
                  <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="pb-[18px] pt-[14px] sm:text-[14px]">Data 1</td>
                  <td className="pb-[18px] pt-[14px] sm:text-[14px]">Data 1</td>
                  <td className="pb-[18px] pt-[14px] sm:text-[14px]">Data 1</td>
                  <td className="pb-[18px] pt-[14px] sm:text-[14px]">
                    <div className="relative inline-block text-left">
                      <button
                        className="rounded bg-brand-400 px-4 py-2 text-white hover:bg-brand-500"
                        onClick={handleEllipsisClick}
                      >
                        <FaEllipsisH />
                      </button>
                      {showDropdown && (
                        <div className="my-1">
                          <div className="ring-black animate-fade-in  absolute right-0 mt-0 flex origin-top-right rounded-md bg-brand-200 shadow-lg ring-opacity-5">
                            <button
                              onClick={() => setIsViewCompanyOpen(true)}
                              className="block px-4 py-2 text-green-700 hover:bg-gray-200"
                            >
                              <FaEye />
                            </button>
                            <button className="block px-4 py-2 text-blue-700 hover:bg-gray-200">
                              <FaEdit />
                            </button>
                            <button
                              onClick={openDeleteModal}
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
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* ADD company Modal */}
      <Transition show={isAddCompanyOpen} as={React.Fragment}>
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
              <div className="z-50 inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-11/12 sm:align-middle">
                {/* Your modal content goes here */}
                <div className="bg-white px-2 pb-4 pt-5 sm:p-2 sm:pb-4">
                  <div className="">
                    {/* Modal Header */}
                    <div className="mt-3 sm:ml-4 sm:mt-0 sm:text-left">
                      <div className="flex flex-row items-center justify-between">
                        <h3
                          className="text-lg font-medium leading-6 text-gray-900"
                          id="modal-title"
                        >
                          Modal Title
                        </h3>
                        <button
                          onClick={() => setIsAddCompanyOpen(false)}
                          type="button"
                          className=" text-3xl text-red-500"
                        >
                          <IoCloseCircle />
                        </button>
                      </div>

                      <div className="mt-10 px-2">
                        <nav aria-label="Progress" className="mb-4">
                          <ol
                            role="list"
                            className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0 lg:space-x-8"
                          >
                            {steps.map((stepItem, index) => (
                              <li
                                key={index}
                                className="flex flex-col md:flex-1"
                              >
                                <a
                                  href="#"
                                  className={`${
                                    stepItem.status === "complete" ||
                                    stepItem.status === "current"
                                      ? "border-l-4 border-brand-500"
                                      : "border-l-4 border-gray-200"
                                  } w-full py-2 pl-4 text-left md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
                                >
                                  <div className="flex flex-col text-left">
                                    <span
                                      className={`text-xs font-medium ${
                                        stepItem.status === "upcoming"
                                          ? "text-gray-500"
                                          : "text-brand-500"
                                      }`}
                                    >
                                      {stepItem.id}
                                    </span>
                                    <span
                                      className={`text-xs font-medium ${
                                        stepItem.status === "upcoming"
                                          ? "text-gray-500"
                                          : "text-brand-500"
                                      }`}
                                    >
                                      {stepItem.name}
                                    </span>
                                  </div>
                                </a>
                              </li>
                            ))}
                          </ol>
                        </nav>
                        <form>{renderStep()}</form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>

      {/* DELETE company Modal */}
      <Transition show={isDeleteCopmanyOpen} as={React.Fragment}>
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
                        Are you sure you want to delete this item?
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
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>

      {/* View company Modal */}
      <Transition show={isViewCopmanyOpen} as={React.Fragment}>
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
              <div className="z-50 inline-block transform overflow-hidden rounded-lg bg-brand-100 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-11/12 sm:align-middle">
                {/* Your modal content goes here */}
                <div className="bg-brand-100 px-2 pb-4 pt-5 sm:p-2 sm:pb-4">
                  <div className="">
                    {/* Modal Header */}
                    <div className="mt-3 sm:ml-4 sm:mt-0 sm:text-left">
                      <div className="flex flex-row items-center justify-between">
                        <h3
                          className="text-lg font-medium leading-6 text-gray-900"
                          id="modal-title"
                        >
                          View Company
                        </h3>
                        <button
                          onClick={() => setIsViewCompanyOpen(false)}
                          type="button"
                          className=" text-3xl text-red-500"
                        >
                          <IoCloseCircle />
                        </button>
                      </div>

                      <div className="mt-10 px-2">
                        <div className="w-ful mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
                          <div className="col-span-4 lg:!mb-0">
                            <Card
                              extra={
                                "items-center w-full h-full p-[16px] bg-cover"
                              }
                            >
                              {/* Background and profile */}
                              <div
                                className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
                                style={{ backgroundImage: `url(${banner})` }}
                              >
                                <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
                                  <img
                                    className="h-full w-full rounded-full"
                                    src={avatar}
                                    alt=""
                                  />
                                </div>
                              </div>

                              {/* Name and position */}
                              <div className="mt-16 flex flex-col items-center">
                                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                                  company name
                                </h4>
                                <p className="text-base font-normal text-gray-600">
                                  category
                                </p>
                              </div>

                              {/* Post followers */}
                              <div className="mb-3 mt-6 flex gap-4 md:!gap-14">
                                <div className="flex flex-col items-center justify-center">
                                  <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                    90
                                  </p>
                                  <p className="text-xs font-normal text-gray-600">
                                    clicks
                                  </p>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                  <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                    10
                                  </p>
                                  <p className="text-xs font-normal text-gray-600">
                                    users
                                  </p>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                  <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                    4
                                  </p>
                                  <p className="text-xs font-normal text-gray-600">
                                    Appointments
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </div>

                          <div className="col-span-3 lg:!mb-0">
                            {/* <Storage /> */}asdas
                          </div>

                          <div className="z-0 col-span-5 lg:!mb-0">
                            {/* <Upload /> */} asdasd
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default CompaniesTable;
