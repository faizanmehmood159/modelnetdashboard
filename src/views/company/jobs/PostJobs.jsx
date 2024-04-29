import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MdVideocam } from "react-icons/md";
import Card from "components/card";
import { IoMdClose } from "react-icons/io";
import { postJob, getPostedJob } from "api/company/job";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { titleSubtitle } from "api/admin/occupation";
import { FaEdit, FaEllipsisH, FaTrash } from "react-icons/fa";
import { deletePostJob } from "api/company/job";
import { updatePostJob } from "api/company/job";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { enableJob } from "api/company/job";
import { disableJob } from "api/company/job";
import Select from "react-select";

const PostJobs = () => {
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isUpdateJobOpen, setIsUpdateJobOpen] = useState(false);
  const [selectedUpdateId, setSelectedUpdateId] = useState(null);
  const [selectedUpdateData, setSelectedUpdateData] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [gotJobs, setGotJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();
  const [titleSubtitleData, setTitleSubtitleData] = useState([]);
  const [showDropdown, setShowDropdown] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isDeletePostOpen, setIsDeletePostOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [enableLoading, setEnableLoading] = useState(false);

  const handleEllipsisClick = (index) => {
    const updatedDropdownState = [...showDropdown];
    updatedDropdownState[index] = !updatedDropdownState[index];
    setShowDropdown(updatedDropdownState);
  };
  const [formData, setFormData] = useState({
    occupationName: "",
    subTitle: "",
    occupationdescription: "",
    occupationVideo: "",
    occupationlocations: [
      {
        address: "",
        longitude: "",
        latitude: "",
        testerDays: [
          {
            startdate: "",
            endDate: "",
            startDuration: "",
            endDuration: "",
          },
        ],
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getTitleSubtitle = {
          type: "get",
        };
        const response = await titleSubtitle(getTitleSubtitle);
        setTitleSubtitleData(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const [videoName, setVideoName] = useState("");
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("jwttoken");
        const response = await getPostedJob(token);
        console.log(response.data.data);

        setGotJobs(response?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState("");

  const handleAddLocation = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      occupationlocations: [
        ...prevFormData.occupationlocations,
        {
          latitude: "",
          longitude: "",
          testerDays: [
            {
              startdate: "",
              endDate: "",
              startDuration: "",
              endDuration: "",
            },
          ],
          address: "",
        },
      ],
    }));
  };

  const handleSearch = async (e, locationIndex) => {
    e.preventDefault();

    try {
      const searchAddress = formData.occupationlocations[locationIndex].address;

      if (searchAddress.trim() !== "") {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchAddress
          )}.json?access_token=pk.eyJ1IjoibWFhemtoYWxpZGJoYXR0aSIsImEiOiJjbHFkcTd1NDkwZnRiMmpwandzdTNuZHZjIn0.ng3u6jqasoaJJRa3NnHUIA`
        );

        const firstFeature = response.data.features[0];
        console.log(firstFeature);
        toast.success("Location added: " + firstFeature?.place_name);

        if (firstFeature) {
          const updatedOccupationLocations = [...formData.occupationlocations];
          const currentLocation = updatedOccupationLocations[locationIndex];

          currentLocation.latitude = firstFeature.center[1];
          currentLocation.longitude = firstFeature.center[0];
          currentLocation.address = firstFeature.place_name;

          setFormData((prevFormData) => ({
            ...prevFormData,
            occupationlocations: updatedOccupationLocations,
          }));
        } else {
          console.log("Location not found.");
          toast.error("Location not found.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostJobClose = () => {
    setIsPostJobOpen(false);
    setVideoName("");
    setFormData({
      occupationName: "",
      subTitle: "",
      occupationdescription: "",
      occupationVideo: "",
      occupationlocations: [
        {
          longitude: "",
          latitude: "",
          testerDays: [
            {
              startdate: "",
              endDate: "",
              startDuration: "",
              endDuration: "",
            },
          ],
        },
      ],
    });
  };
  const handleEditClick = (item) => {
    setSelectedUpdateId(item._id);
    setFormData(item);
    setIsUpdateJobOpen(true);
    console.log(item);
  };
  const closeEditModal = () => {
    setIsUpdateJobOpen(false);
    setVideoName("");
  };

  const handlePostJobSubmit = async (e) => {
    e.preventDefault();
    const long = localStorage.getItem("longitude");
    const lat = localStorage.getItem("latitude");

    try {
      let showToast = true;

      if (!formData.occupationName.trim()) {
        toast.warn("Please select a title");
        showToast = false;
      }

      if (!formData.subTitle.trim() && showToast) {
        toast.warn("Please select subtitle");
        showToast = false;
      }

      if (!formData.occupationdescription.trim() && showToast) {
        toast.warn("Please add a description");
        showToast = false;
      }

      if (!formData.occupationVideo && showToast) {
        toast.warn("Please upload a video");
        showToast = false;
      }

      const isValidLocations = formData.occupationlocations.every(
        (location) => {
          return (
            location.longitude &&
            location.latitude &&
            location.testerDays.every((testerDay) => {
              const startDate = new Date(testerDay.startdate);
              const endDate = new Date(testerDay.endDate);
              if (endDate <= startDate && showToast) {
                toast.warn("End date must be greater than start date");
                showToast = false;
              }

              return (
                testerDay.startdate &&
                testerDay.endDate &&
                testerDay.startDuration &&
                testerDay.endDuration
              );
            })
          );
        }
      );

      if (!isValidLocations && showToast) {
        toast.warn("Please fill in all Timing and Address details");
        showToast = false;
      }

      if (!showToast) {
        return;
      }
      console.log(lat);
      console.log(long);
      setPostLoading(true);
      const body = {
        video: formData.occupationVideo,
        body: JSON.stringify({
          occupationName: formData.occupationName,
          subTitle: formData.subTitle,
          occupationdescription: formData.occupationdescription,
          occupationVideo: formData.occupationVideo,
          occupationlocations: formData.occupationlocations.map((location) => ({
            longitude: location.longitude,
            latitude: location.latitude,
            address: location.address,
            testerDays: location.testerDays.map((testerDay) => ({
              startdate: testerDay.startdate,
              endDate: testerDay.endDate,
              startDuration: testerDay.startDuration,
              endDuration: testerDay.endDuration,
            })),
          })),
        }),
      };

      console.log(body);
      const response = await postJob(body);
      toast.success(response.data.message);
      navigate("/company/dashboard");

      console.log(response.data);
      setFormData({
        occupationName: "",
        subTitle: "",
        occupationdescription: "",
        occupationVideo: "",
        occupationlocations: [
          {
            longitude: "",
            latitude: "",
            testerDays: [
              {
                startdate: "",
                endDate: "",
                startDuration: "",
                endDuration: "",
              },
            ],
          },
        ],
      });

      setIsPostJobOpen(false);
    } catch (error) {
      console.error("Error posting job:", error.response.data);
      toast.error(error.response.data.message);
    } finally {
      setPostLoading(false);
    }
  };

  const handleAddTesterDay = (locationIndex) => {
    const newOccupationLocations = [...formData.occupationlocations];
    newOccupationLocations[locationIndex].testerDays.push({
      startdate: "",
      endDate: "",
      startDuration: "",
      endDuration: "",
    });

    setFormData({
      ...formData,
      occupationlocations: newOccupationLocations,
    });
  };

  const handleRemoveAddress = (locationIndex) => {
    console.log(locationIndex);
    const updatedOccupationLocations = [...formData.occupationlocations];
    updatedOccupationLocations.splice(locationIndex, 1);

    setFormData((prevFormData) => ({
      ...prevFormData,
      occupationlocations: updatedOccupationLocations,
    }));
  };

  const handleRemoveTesterDay = (locationIndex, testerDayIndex) => {
    const newOccupationLocations = [...formData.occupationlocations];
    const testerDays = newOccupationLocations[locationIndex].testerDays;

    if (testerDayIndex > 0 || testerDays.length > 1) {
      testerDays.splice(testerDayIndex, 1);

      setFormData({
        ...formData,
        occupationlocations: newOccupationLocations,
      });
    }
  };

  const openDeleteModal = (jobId) => {
    setSelectedPostId(jobId);
    setIsDeletePostOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeletePostOpen(false);
  };

  const onDelete = async () => {
    const token = localStorage.getItem("jwttoken");

    try {
      setDeleteLoading(false);
      const response = await deletePostJob(token, selectedPostId);

      if (response.data.status === 200) {
        toast.success(response.data.message);
        navigate("/company/dashboard");
        closeDeleteModal();
        setDeleteLoading(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
    closeDeleteModal();
  };

  const handleUpdateJobSubmit = async (e) => {
    e.preventDefault();
    const long = localStorage.getItem("longitude");
    const lat = localStorage.getItem("latitude");

    try {
      let showToast = true;

      if (!formData.occupationName.trim()) {
        toast.warn("Please select a title");
        showToast = false;
      }

      if (!formData.occupationdescription.trim() && showToast) {
        toast.warn("Please add a description");
        showToast = false;
      }

      if (!formData.occupationVideo && showToast) {
        toast.warn("Please upload a video");
        showToast = false;
      }

      const isValidLocations = formData.occupationlocations.every(
        (location) => {
          return (
            location.longitude &&
            location.latitude &&
            location.testerDays.every((testerDay) => {
              const startDate = new Date(testerDay.startdate);
              const endDate = new Date(testerDay.endDate);

              if (endDate <= startDate && showToast) {
                toast.warn("End date must be greater than start date");
                showToast = false;
              }

              return (
                testerDay.startdate &&
                testerDay.endDate &&
                testerDay.startDuration &&
                testerDay.endDuration
              );
            })
          );
        }
      );

      if (!isValidLocations && showToast) {
        toast.warn("Please fill in all location details");
        showToast = false;
      }

      if (!showToast) {
        return;
      }

      console.log(lat);
      console.log(long);
      setPostLoading(true);

      const body = {
        video: formData.occupationVideo,
        body: JSON.stringify({
          jobPostid: selectedUpdateId,
          occupationName: formData.occupationName,
          subTitle: formData.subTitle,
          occupationdescription: formData.occupationdescription,
          occupationVideo: formData.occupationVideo,
          occupationlocations: formData.occupationlocations.map((location) => ({
            longitude: location.longitude,
            latitude: location.latitude,
            address: location.address,
            testerDays: location.testerDays.map((testerDay) => ({
              startdate: testerDay.startdate,
              endDate: testerDay.endDate,
              startDuration: testerDay.startDuration,
              endDuration: testerDay.endDuration,
            })),
          })),
        }),
      };

      console.log(body);

      const response = await updatePostJob(body);
      toast.success(response.data.message);
      navigate("/company/dashboard");

      console.log(response.data);

      setFormData({
        occupationName: "",
        subTitle: "",
        occupationdescription: "",
        occupationVideo: "",
        occupationlocations: [
          {
            longitude: "",
            latitude: "",
            testerDays: [
              {
                startdate: "",
                endDate: "",
                startDuration: "",
                endDuration: "",
              },
            ],
          },
        ],
      });

      setSelectedPostId(null);
      setIsUpdateJobOpen(false);
    } catch (error) {
      console.error("Error updating job:", error.response.data);
      toast.error(error.response.data.message);
    } finally {
      setPostLoading(false);
    }
  };

  const [job, setJob] = useState("");
  const [selectedJobIdTo, setselectedJobIdTo] = useState(null);

  const confirmEnable = async () => {
    try {
      setEnableLoading(true);
      const token = localStorage.getItem("jwttoken");
      console.log(selectedJobIdTo);

      const response = await enableJob(selectedJobIdTo, token);
      console.log(response);
      const updatedJobsResponse = await getPostedJob(token);
      console.log(updatedJobsResponse.data.data);

      setGotJobs(updatedJobsResponse?.data?.data);
      toast.success("Job Enabled Successfully.");
      setEnableLoading(false);
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setEnableLoading(false);
      setselectedJobIdTo(null);
    }
  };
  const confirmDisable = async () => {
    try {
      setEnableLoading(true);
      const token = localStorage.getItem("jwttoken");
      console.log(selectedJobIdTo);

      const response = await disableJob(selectedJobIdTo, token);
      console.log(response);
      const updatedJobsResponse = await getPostedJob(token);
      console.log(updatedJobsResponse.data.data);

      setGotJobs(updatedJobsResponse?.data?.data);
      toast.success("Job Disabled Successfully.");
      setEnableLoading(false);
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setEnableLoading(false);
      setselectedJobIdTo(null);
    }
  };

  return (
    <>
      <Card extra={"w-full h-full my-6 p-4 sm:overflow-x-auto"}>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
          </div>
        ) : (
          <>
            <div>
              <div className="flex flex-row items-center justify-between">
                <div></div>
                <button
                  className="m-4 rounded-md bg-brand-50 px-4 py-2 text-white  "
                  onClick={() => setIsPostJobOpen(true)}
                >
                  Post Job
                </button>
              </div>
              <div className="w-full">
                <div className="mt-8 h-full overflow-x-scroll xl:overflow-hidden">
                  <div className="max-h-[80vh] overflow-y-auto">
                    <table className="w-full whitespace-nowrap text-center">
                      <thead>
                        <tr>
                          <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-brand-50">
                            #
                          </th>
                          <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-brand-50">
                            Name
                          </th>
                          <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-brand-50">
                            Tester Days
                          </th>
                          <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-brand-50">
                            Address
                          </th>
                          <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-brand-50">
                            Enabled/Disabled
                          </th>
                          <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-brand-50">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {gotJobs.map((item, index) => (
                          <tr key={item._id} className="">
                            <td className="pb-4 pt-4 sm:text-base">
                              <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                                <li className="m-2 w-full rounded p-2 shadow-md">
                                  {index + 1}
                                </li>
                              </ul>
                            </td>
                            <td className="pb-4 pt-4 sm:text-base">
                              <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                                <li className="m-2 w-full rounded p-2 shadow-md">
                                  {item.occupationName}
                                </li>
                              </ul>
                            </td>
                            <td>
                              {item.occupationlocations.map(
                                (location, index) => (
                                  <React.Fragment key={index}>
                                    <ul className="w-full	list-none">
                                      <li className="mw-full flex list-none items-center	justify-center ">
                                        <ul className="flex list-inside list-none flex-row items-center justify-center px-2">
                                          {location.testerDays.map(
                                            (testerDay, testerDayIndex) => (
                                              <li
                                                key={testerDayIndex}
                                                className="m-2 flex flex-col rounded p-2 shadow-md "
                                              >
                                                <p>
                                                  {testerDay.startdate} to{" "}
                                                  {testerDay.endDate},
                                                </p>
                                                <p>
                                                  {testerDay.startDuration} to{" "}
                                                  {testerDay.endDuration}
                                                </p>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </li>
                                    </ul>
                                  </React.Fragment>
                                )
                              )}
                            </td>

                            <td className="flex h-full flex-col items-center self-center">
                              {item.occupationlocations.map(
                                (location, index) => (
                                  <React.Fragment key={index}>
                                    <ul className="flex list-inside list-none flex-row items-center justify-center px-2">
                                      <li className="flex w-full list-none items-center	justify-center">
                                        <ul className="flex list-inside list-none flex-row items-center justify-center px-2">
                                          <li className="m-2 flex flex-col rounded p-2 shadow-md ">
                                            <p>{location.address}</p>
                                          </li>
                                        </ul>
                                      </li>
                                    </ul>
                                  </React.Fragment>
                                )
                              )}
                            </td>

                            <td className="pb-4 pt-4 sm:text-base">
                              <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                                <li className="m-2 w-full rounded p-2 shadow-md">
                                  <input
                                    type="checkbox"
                                    checked={item.enable === true}
                                    onChange={(event) => {
                                      setJob(item);
                                      setselectedJobIdTo(item._id);
                                      console.log(item);
                                      console.log(item._id);
                                    }}
                                  />
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
                                    <div className="ring-black animate-fade-in  bg-whit absolute right-0 mt-0 flex origin-top-right rounded-md shadow-lg ring-opacity-5">
                                      <button
                                        onClick={() => handleEditClick(item)}
                                        className="block px-4 py-2 text-blue-700 hover:bg-gray-200"
                                      >
                                        <FaEdit />
                                      </button>
                                      <button
                                        onClick={() =>
                                          openDeleteModal(item._id)
                                        }
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
              </div>
            </div>
          </>
        )}
      </Card>

      <Transition show={isPostJobOpen} as={React.Fragment}>
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
              <div className="z-50 inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
                {postLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
                  </div>
                ) : (
                  <div className="bg-white px-2 pb-4 pt-4 sm:p-6 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <h1
                        className="text-lg font-medium leading-6 text-gray-900 "
                        id="modal-title"
                      >
                        Post Job
                      </h1>
                      <button
                        onClick={handlePostJobClose}
                        className="rounded-full bg-red-500 text-white hover:bg-red-600 focus:border-yellow-300 focus:outline-none focus:ring"
                      >
                        <IoMdClose style={{ height: "24px", width: "24px" }} />
                      </button>
                    </div>
                    <form
                      className="mt-5 space-y-6"
                      onSubmit={handlePostJobSubmit}
                    >
                      <div className="w-full">
                        <div className="w-full">
                          <div>
                            <div className="mt-2 w-1/2 sm:w-full">
                              <label className="block text-sm font-medium leading-6 text-gray-900">
                                Occupation Name
                              </label>
                              <Select
                                className="w-full"
                                options={titleSubtitleData.map((item) => ({
                                  value: item.title.text,
                                  label: item.title.text,
                                }))}
                                value={{
                                  value: formData.occupationName,
                                  label: formData.occupationName,
                                }}
                                onChange={(selectedOption) =>
                                  setFormData({
                                    ...formData,
                                    occupationName: selectedOption.value,
                                    subTitle: "",
                                  })
                                }
                                placeholder="Select Title"
                              />
                            </div>

                            {formData.occupationName && (
                              <div className="mt-2 w-1/2 sm:w-full">
                                <label className="mb-2 block text-sm font-bold">
                                  Subtitle
                                </label>
                                <Select
                                  className="w-full"
                                  options={
                                    titleSubtitleData
                                      .find(
                                        (item) =>
                                          item.title.text ===
                                          formData.occupationName
                                      )
                                      ?.subTitles?.map((subtitle) => ({
                                        value: subtitle.text,
                                        label: subtitle.text,
                                      })) || []
                                  }
                                  value={{
                                    value: formData.subTitle,
                                    label: formData.subTitle,
                                  }}
                                  onChange={(selectedOption) =>
                                    setFormData({
                                      ...formData,
                                      subTitle: selectedOption.value,
                                    })
                                  }
                                  placeholder="Select Subtitle"
                                />
                              </div>
                            )}
                          </div>

                          <div className="mb-2 w-full">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Occupation Description
                            </label>
                            <textarea
                              type="text"
                              className="mt-1 block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-50 sm:text-sm sm:leading-6"
                              value={formData.occupationdescription}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  occupationdescription: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="relative mb-2 rounded-lg border border-dashed border-gray-600 p-4 text-center">
                          <label
                            htmlFor="occupationVideo"
                            className="block text-sm font-medium text-gray-600"
                          >
                            <MdVideocam className="mx-auto mb-2 text-[80px] text-brand-50 dark:text-white" />
                            <div className="flex items-center justify-center">
                              {videoName ? (
                                <p className="mt-2 text-sm text-gray-600">
                                  Selected Video: {videoName}
                                </p>
                              ) : (
                                <p className="mt-2 text-sm text-gray-600">
                                  No video selected
                                </p>
                              )}
                            </div>
                            <input
                              id="occupationVideo"
                              className="hidden"
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  occupationVideo: e.target.files[0],
                                });
                                setVideoName(e.target.files[0].name);
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Occupation Locations */}
                      {formData.occupationlocations.map(
                        (location, locationIndex) => (
                          <div
                            key={locationIndex}
                            className="mt-6 rounded bg-blue-100 px-2 pb-2 shadow-md"
                          >
                            <div className="flex w-full flex-row items-center justify-between">
                              <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                Occupation #{locationIndex + 1}
                              </h3>
                              <button
                                type="button"
                                className="border-transparent m-2 inline-flex items-center rounded-md border bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                onClick={() =>
                                  handleRemoveAddress(locationIndex)
                                }
                              >
                                <IoClose />
                              </button>
                            </div>
                            <div className="flex w-full flex-row items-center justify-between">
                              <input
                                className="mr-2 flex w-2/3  rounded border border-gray-300 px-2 py-1"
                                type="text"
                                value={location.address}
                                onChange={(e) => {
                                  const updatedOccupationLocations = [
                                    ...formData.occupationlocations,
                                  ];
                                  updatedOccupationLocations[
                                    locationIndex
                                  ].address = e.target.value;

                                  setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    occupationlocations:
                                      updatedOccupationLocations,
                                  }));
                                }}
                                placeholder="Enter address..."
                              />

                              <button
                                type="button"
                                className="border-transparent m-2 inline-flex items-center rounded-md border bg-brand-50 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-50 focus:ring-offset-2"
                                onClick={(e) => handleSearch(e, locationIndex)}
                              >
                                Add Address
                              </button>
                            </div>

                            {/* Tester Days */}
                            {location.testerDays.map(
                              (testerDay, testerDayIndex) => (
                                <div key={testerDayIndex} className="mt-4">
                                  <div className=" flex w-full flex-row items-center justify-between">
                                    <h3 className="text-md font-medium leading-6 text-gray-900">
                                      Tester Day #{testerDayIndex + 1}
                                    </h3>
                                    <div className="">
                                      <button
                                        type="button"
                                        className="border-transparent m-2 inline-flex items-center rounded-md border bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        onClick={() =>
                                          handleRemoveTesterDay(
                                            locationIndex,
                                            testerDayIndex
                                          )
                                        }
                                      >
                                        <IoClose />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="sm:flex sm:space-x-4">
                                    <div className="mb-2 sm:w-1/4">
                                      <label className="block text-sm font-medium leading-6 text-gray-900">
                                        Start Date
                                      </label>
                                      <input
                                        min={new Date().toJSON().slice(0, 10)}
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-50 sm:text-sm sm:leading-6"
                                        value={testerDay.startdate}
                                        onChange={(e) => {
                                          const newOccupationLocations = [
                                            ...formData.occupationlocations,
                                          ];
                                          newOccupationLocations[
                                            locationIndex
                                          ].testerDays[
                                            testerDayIndex
                                          ].startdate = e.target.value;

                                          setFormData({
                                            ...formData,
                                            occupationlocations:
                                              newOccupationLocations,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="mb-2 sm:w-1/4">
                                      <label className="block text-sm font-medium leading-6 text-gray-900">
                                        End Date
                                      </label>
                                      <input
                                        min={new Date().toJSON().slice(0, 10)}
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-50 sm:text-sm sm:leading-6"
                                        value={testerDay.endDate}
                                        onChange={(e) => {
                                          const newOccupationLocations = [
                                            ...formData.occupationlocations,
                                          ];
                                          newOccupationLocations[
                                            locationIndex
                                          ].testerDays[testerDayIndex].endDate =
                                            e.target.value;

                                          setFormData({
                                            ...formData,
                                            occupationlocations:
                                              newOccupationLocations,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="mb-2 sm:w-1/4">
                                      <label className="block text-sm font-medium leading-6 text-gray-900">
                                        Start Time
                                      </label>
                                      <input
                                        type="time"
                                        className="mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-50 sm:text-sm sm:leading-6"
                                        value={testerDay.startDuration}
                                        onChange={(e) => {
                                          const newOccupationLocations = [
                                            ...formData.occupationlocations,
                                          ];
                                          newOccupationLocations[
                                            locationIndex
                                          ].testerDays[
                                            testerDayIndex
                                          ].startDuration = e.target.value;

                                          setFormData({
                                            ...formData,
                                            occupationlocations:
                                              newOccupationLocations,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="mb-2 sm:w-1/4">
                                      <label className="block text-sm font-medium leading-6 text-gray-900">
                                        End Time
                                      </label>
                                      <input
                                        type="time"
                                        className="mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-50 sm:text-sm sm:leading-6"
                                        value={testerDay.endDuration}
                                        onChange={(e) => {
                                          const newOccupationLocations = [
                                            ...formData.occupationlocations,
                                          ];
                                          newOccupationLocations[
                                            locationIndex
                                          ].testerDays[
                                            testerDayIndex
                                          ].endDuration = e.target.value;

                                          setFormData({
                                            ...formData,
                                            occupationlocations:
                                              newOccupationLocations,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="mb-2 sm:w-1/4"></div>

                                    <div className="mb-2 sm:w-1/4"></div>
                                  </div>
                                </div>
                              )
                            )}

                            {/* Button to add a new tester day */}
                            <div className="flex w-full flex-row items-center justify-end">
                              <button
                                type="button"
                                className="border-transparent m-2 inline-flex items-center rounded-md border bg-brand-50 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-50 focus:ring-offset-2"
                                onClick={() =>
                                  handleAddTesterDay(locationIndex)
                                }
                              >
                                Add Tester Day
                              </button>
                            </div>
                          </div>
                        )
                      )}

                      {/* Button to add a new occupation location */}
                      <div className="flex w-full flex-row items-center justify-center">
                        <button
                          type="button"
                          className="border-transparent m-2 inline-flex items-center rounded-md border bg-brand-50 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-50 focus:ring-offset-2"
                          onClick={handleAddLocation}
                        >
                          Add Occupation Location
                        </button>
                      </div>

                      <div className="flex items-center justify-center">
                        <button
                          type="submit"
                          className="border-transparent inline-flex justify-center rounded-md border bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Post Job
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>

      {/* Modal for enabled/discabled */}

      <Transition show={selectedJobIdTo !== null} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setselectedJobIdTo(null)}
        >
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
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                {enableLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg
                            className="h-6 w-6 text-green-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          ></Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to change Status of this
                              Job?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      {job.enable === true ? (
                        <>
                          <button
                            onClick={confirmDisable}
                            type="button"
                            className={`border-transparent inline-flex w-full justify-center rounded-md border bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                          >
                            Disable Job
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={confirmEnable}
                            type="button"
                            className={`border-transparent inline-flex w-full justify-center rounded-md border bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                          >
                            Enable Job
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setselectedJobIdTo(null)}
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Edit job modal */}
      <Transition show={isUpdateJobOpen} as={React.Fragment}>
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
              <div className="z-50 inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
                {postLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
                  </div>
                ) : (
                  <div className="bg-white px-2 pb-4 pt-4 sm:p-6 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <h1
                        className="text-lg font-medium leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Update Job
                      </h1>
                      <button
                        onClick={closeEditModal}
                        className="rounded-full bg-red-500 text-white hover:bg-red-600 focus:border-yellow-300 focus:outline-none focus:ring"
                      >
                        <IoMdClose style={{ height: "24px", width: "24px" }} />
                      </button>
                    </div>
                    <form
                      className="mt-5 space-y-6"
                      onSubmit={handleUpdateJobSubmit}
                    >
                      <div className="w-full">
                        <div className="w-full">
                          <div className="mt-2 w-1/2 sm:w-full">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Occupation Name
                            </label>
                            <Select
                              className="w-full"
                              options={titleSubtitleData.map((item) => ({
                                value: item.title.text,
                                label: item.title.text,
                              }))}
                              value={{
                                value: formData.occupationName,
                                label: formData.occupationName,
                              }}
                              onChange={(selectedOption) =>
                                setFormData({
                                  ...formData,
                                  occupationName: selectedOption.value,
                                  subTitle: "",
                                })
                              }
                              placeholder="Select Title"
                            />
                          </div>

                          {formData.occupationName && (
                            <div className="mt-2 w-1/2 sm:w-full">
                              <label className="mb-2 block text-sm font-bold">
                                Subtitle
                              </label>
                              <Select
                                className="w-full"
                                options={
                                  titleSubtitleData
                                    .find(
                                      (item) =>
                                        item.title.text ===
                                        formData.occupationName
                                    )
                                    ?.subTitles?.map((subtitle) => ({
                                      value: subtitle.text,
                                      label: subtitle.text,
                                    })) || []
                                }
                                value={{
                                  value: formData.subTitle,
                                  label: formData.subTitle,
                                }}
                                onChange={(selectedOption) =>
                                  setFormData({
                                    ...formData,
                                    subTitle: selectedOption.value,
                                  })
                                }
                                placeholder="Select Subtitle"
                              />
                            </div>
                          )}

                          <div className="mb-2 w-full">
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Occupation Description
                            </label>
                            <textarea
                              type="text"
                              className="mt-1 block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-50 sm:text-sm sm:leading-6"
                              value={formData.occupationdescription}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  occupationdescription: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="relative mb-2 rounded-lg border border-dashed border-gray-600 p-4 text-center">
                          <label
                            htmlFor="occupationVideo"
                            className="block text-sm font-medium text-gray-600"
                          >
                            <MdVideocam className="mx-auto mb-2 text-[80px] text-brand-50 dark:text-white" />
                            {videoName ? (
                              <p className="mt-2 text-sm text-gray-600">
                                Selected Video: {videoName}
                              </p>
                            ) : (
                              <p className="mt-2 text-sm text-gray-600">
                                No video selected
                              </p>
                            )}
                            <input
                              id="occupationVideo"
                              className="hidden"
                              type="file"
                              accept="video/*"
                              onChange={(e) => {
                                setFormData({
                                  ...formData,
                                  occupationVideo: e.target.files[0],
                                });
                                setVideoName(e.target.files[0].name);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="my-10 flex  w-full flex-row items-center justify-center">
                        <video
                          className="h-[20vh] w-auto"
                          controls
                          style={{
                            height: "300px !important",
                            marginTop: "10px",
                          }}
                        >
                          <source
                            type="video/mp4"
                            src={formData.occupationVideo}
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>

                      {/* Occupation Locations */}
                      {formData.occupationlocations.map(
                        (location, locationIndex) => (
                          <div
                            key={locationIndex}
                            className="mt-6 rounded bg-blue-100 px-2 pb-2 shadow-md"
                          >
                            <div className="flex w-full flex-row items-center justify-between">
                              <h3 className="text-xl font-semibold leading-6 text-gray-900">
                                Occupation #{locationIndex + 1}
                              </h3>
                              <button
                                type="button"
                                className="border-transparent m-2 inline-flex items-center rounded-md border bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                onClick={() =>
                                  handleRemoveAddress(locationIndex)
                                }
                              >
                                <IoClose />
                              </button>
                            </div>
                            <div className="flex w-full flex-row items-center justify-between">
                              <input
                                className="mr-2 flex w-2/3  rounded border border-gray-300 px-2 py-1"
                                type="text"
                                value={location.address}
                                onChange={(e) => {
                                  const updatedOccupationLocations = [
                                    ...formData.occupationlocations,
                                  ];
                                  updatedOccupationLocations[
                                    locationIndex
                                  ].address = e.target.value;

                                  setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    occupationlocations:
                                      updatedOccupationLocations,
                                  }));
                                }}
                                placeholder="Enter address..."
                              />

                              <button
                                type="button"
                                className="border-transparent m-2 inline-flex items-center rounded-md border bg-brand-50 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-50 focus:ring-offset-2"
                                onClick={(e) => handleSearch(e, locationIndex)}
                              >
                                Add Address
                              </button>
                            </div>
                            {/* Tester Days */}
                            {location.testerDays.map(
                              (testerDay, testerDayIndex) => (
                                <div key={testerDayIndex} className="mt-4">
                                  <div className=" flex w-full flex-row items-center justify-between">
                                    <h3 className="text-md font-medium leading-6 text-brand-50">
                                      Tester Day #{testerDayIndex + 1}
                                    </h3>
                                    <div className="">
                                      <button
                                        type="button"
                                        className="border-transparent m-2 inline-flex items-center rounded-md border bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                        onClick={() =>
                                          handleRemoveTesterDay(
                                            locationIndex,
                                            testerDayIndex
                                          )
                                        }
                                      >
                                        <IoClose />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="sm:flex sm:space-x-4">
                                    <div className="mb-2 sm:w-1/4">
                                      <label className="block text-sm font-medium leading-6 text-gray-900">
                                        Start Date
                                      </label>
                                      <input
                                        min={new Date().toJSON().slice(0, 10)}
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-50 sm:text-sm sm:leading-6"
                                        value={testerDay.startdate}
                                        onChange={(e) => {
                                          const newOccupationLocations = [
                                            ...formData.occupationlocations,
                                          ];
                                          newOccupationLocations[
                                            locationIndex
                                          ].testerDays[
                                            testerDayIndex
                                          ].startdate = e.target.value;

                                          setFormData({
                                            ...formData,
                                            occupationlocations:
                                              newOccupationLocations,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="mb-2 sm:w-1/4">
                                      <label className="block text-sm font-medium leading-6 text-gray-900">
                                        End Date
                                      </label>
                                      <input
                                        min={new Date().toJSON().slice(0, 10)}
                                        type="date"
                                        className="mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-50 sm:text-sm sm:leading-6"
                                        value={testerDay.endDate}
                                        onChange={(e) => {
                                          const newOccupationLocations = [
                                            ...formData.occupationlocations,
                                          ];
                                          newOccupationLocations[
                                            locationIndex
                                          ].testerDays[testerDayIndex].endDate =
                                            e.target.value;

                                          setFormData({
                                            ...formData,
                                            occupationlocations:
                                              newOccupationLocations,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="mb-2 sm:w-1/4">
                                      <label className="block text-sm font-medium leading-6 text-gray-900">
                                        Start Time
                                      </label>
                                      <input
                                        type="time"
                                        className="mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-50 sm:text-sm sm:leading-6"
                                        value={testerDay.startDuration}
                                        onChange={(e) => {
                                          const newOccupationLocations = [
                                            ...formData.occupationlocations,
                                          ];
                                          newOccupationLocations[
                                            locationIndex
                                          ].testerDays[
                                            testerDayIndex
                                          ].startDuration = e.target.value;

                                          setFormData({
                                            ...formData,
                                            occupationlocations:
                                              newOccupationLocations,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="mb-2 sm:w-1/4">
                                      <label className="block text-sm font-medium leading-6 text-gray-900">
                                        End Time
                                      </label>
                                      <input
                                        type="time"
                                        className="mt-1 block w-full rounded-md border-0 px-2 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-50 sm:text-sm sm:leading-6"
                                        value={testerDay.endDuration}
                                        onChange={(e) => {
                                          const newOccupationLocations = [
                                            ...formData.occupationlocations,
                                          ];
                                          newOccupationLocations[
                                            locationIndex
                                          ].testerDays[
                                            testerDayIndex
                                          ].endDuration = e.target.value;

                                          setFormData({
                                            ...formData,
                                            occupationlocations:
                                              newOccupationLocations,
                                          });
                                        }}
                                      />
                                    </div>

                                    <div className="mb-2 sm:w-1/4"></div>

                                    <div className="mb-2 sm:w-1/4"></div>
                                  </div>
                                </div>
                              )
                            )}

                            {/* Button to add a new tester day */}
                            <div className="flex w-full flex-row items-center justify-end">
                              <button
                                type="button"
                                className="border-transparent m-2 inline-flex items-center rounded-md border bg-brand-50 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-50 focus:ring-offset-2"
                                onClick={() =>
                                  handleAddTesterDay(locationIndex)
                                }
                              >
                                Add Tester Day
                              </button>
                            </div>
                          </div>
                        )
                      )}

                      {/* Button to add a new occupation location */}
                      <div className="flex w-full flex-row items-center justify-center">
                        <button
                          type="button"
                          className="border-transparent m-2 inline-flex items-center rounded-md border bg-brand-50 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-50 focus:ring-offset-2"
                          onClick={handleAddLocation}
                        >
                          Add Occupation Location
                        </button>
                      </div>

                      <div className="flex items-center justify-center">
                        <button
                          type="submit"
                          className="border-transparent inline-flex justify-center rounded-md border bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Post Job
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>

      {/* DELETE Job Modal */}
      <Transition show={isDeletePostOpen} as={React.Fragment}>
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
                  <div className="flex h-full items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 "></div>
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
                            Are you sure you want to delete this Job?
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
    </>
  );
};

export default PostJobs;
