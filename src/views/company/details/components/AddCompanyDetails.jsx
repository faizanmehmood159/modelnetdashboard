import React, { useState, useEffect } from "react";
import Card from "components/card";
import { FaVideo } from "react-icons/fa";
import { Transition } from "@headlessui/react";
import { IoCloseCircle } from "react-icons/io5";
import { titleSubtitle } from "api/admin/occupation";
import { MdFileUpload } from "react-icons/md";
import { toast } from "react-toastify";
import {
  addCompanyDetails,
  getCompanyDetails,
} from "../../../../api/company/details";
import UpdateCompanyDetails from "./UpdateCompanyDetails";
import MapBox from "components/mapBox";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const AddCompanyDetails = () => {
  const [companyData, setCompanyData] = useState({});
  console.log(companyData);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("jwttoken");
        const response = await getCompanyDetails(token);
        setCompanyData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

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
      name: "Content Upload",
      status: step >= 3 ? "complete" : "upcoming",
    },
    {
      id: "Step 4",
      name: "Add Location",
      status: step >= 4 ? "complete" : "upcoming",
    },
  ];
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+([a-z]{2,})+(\S+)?$/i;

  const nextStep = () => {
    if (step < totalSteps) {
      if (step === 1) {
        if (!formData.companyName) {
          toast.warn("Please write company names");
          return;
        } else if (!formData.companyDescription) {
          toast.warn("please write description.");
          return;
        } else {
          setStep(step + 1);
        }
      }

      if (step === 2) {
        if (!formData.facebook || !urlRegex.test(formData.facebook)) {
          toast.warn("Please enter a valid Facebook URL");
          return;
        } else if (!formData.twitter || !urlRegex.test(formData.twitter)) {
          toast.warn("Please enter a valid Twitter URL");
          return;
        } else if (!formData.instagram || !urlRegex.test(formData.instagram)) {
          toast.warn("Please enter a valid Instagram URL");
          return;
        } else {
          setStep(step + 1);
        }
      }
      if (step === 3) {
        if (!selectedImage) {
          toast.warn("please upload image.");
          return;
        } else
        if (!selectedCoverImage) {
          toast.warn("please upload Cover image.");
          return;
        }
        else if (!videoFile) {
          toast.warn("please Upload Video.");
          return;
        } else {
          setStep(step + 1);
        }
      }
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "dummy",
    subtitle: "dummy",
    companyName: "",
    companyDescription: "",
    topRated: false,
    facebook: "",
    twitter: "",
    instagram: "",
    linkedIn: "",
    image: "",
    coverImage: "",
    video: "",
    state: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };
  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedCoverImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };
  const [videoFile, setVideoFile] = useState(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setVideoFile(file);
    }
  };

  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [titleSubtitleData, setTitleSubtitleData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getTitleSubtitle = {
          type: "get",
        };
        const response = await titleSubtitle(getTitleSubtitle);
        setTitleSubtitleData(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [searchAddress, setSearchAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      if (searchAddress.trim() !== "") {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            searchAddress
          )}.json?access_token=pk.eyJ1IjoibWFhemtoYWxpZGJoYXR0aSIsImEiOiJjbHFkcTd1NDkwZnRiMmpwandzdTNuZHZjIn0.ng3u6jqasoaJJRa3NnHUIA`
        );
        const firstFeature = response.data.features[0];

        if (firstFeature) {
          setLatitude(response.data.features[0].geometry.coordinates[1]);
          setLongitude(response.data.features[0].geometry.coordinates[0]);
          setSearchAddress(firstFeature?.place_name);
          toast.success("Address is: " + firstFeature?.place_name);
        } else {
          console.log("Address not found.");
          toast.error("Address not found.");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.state) {
        toast.warn("please write state.");
        return;
      } else if (!longitude) {
        toast.warn("please Enter address.");
        return;
      }

      setAddLoading(true);
      const dataToSend = {
        video: videoFile,
        body: JSON.stringify({
          title: formData.title,
          subTitle: formData.subtitle,
          companyName: formData.companyName,
          address: {
            address: searchAddress,
            states: formData.state,
            longitude: longitude,
            latitude: latitude,
          },
          video: "hasgjdhgajs",
          image: selectedImage,
          coverImage: selectedCoverImage,
          description: formData.companyDescription,
          topRated: formData.topRated,
          facebook: formData.facebook,
          twitter: formData.twitter,
          instagram: formData.instagram,
          linkedin: formData.linkedIn,
        }),
      };


      const parsedBody = JSON.parse(dataToSend.body);
      console.log(parsedBody.coverImage);
      

      const response = await addCompanyDetails(dataToSend);
      if (response.status === 200) {
        console.log("Company details added successfully!");
        toast.success("company details added successfully");
        setIsAddCompanyOpen(false);
        navigate("/company/dashboard");
        setAddLoading(false);
      } else {
      }
    } catch (error) {
      if (error.response.data.message === "Field value too long") {
        toast.error("please select small image.");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      setAddLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            {/* Step 1 content */}
            {/* Categories select */}
            <div>
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
                className=" mx-2 w-full rounded-md bg-brand-50 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
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
                className=" mx-2 w-full rounded-md bg-brand-50 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  prevStep();
                }}
              >
                Previous
              </button>
              <button
                className=" mx-2 w-full rounded-md bg-brand-50 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
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
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3">
                <div className="">
                  <label className="mb-2 block text-sm font-bold">Image</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {selectedImage && (
                    <div className="flex h-full w-full flex-row items-center justify-center">
                      <img
                        className="h-[20vh] w-auto"
                        src={selectedImage}
                        alt="Selected"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>
                <div className="">
                  <label className="mb-2 block text-sm font-bold"> Cover Image</label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                  />
                  {selectedCoverImage && (
                    <div className="flex h-full w-full flex-row items-center justify-center">
                      <img
                        className="h-[20vh] w-auto"
                        src={selectedCoverImage}
                        alt="Selected"
                        style={{ maxWidth: "100%", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </div>
                <div className="">
                  <label className="mb-2 block text-sm font-bold">Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                  />
                  <div className="flex items-center justify-center">
                    {videoFile && (
                      <video
                        className="h-[20vh] w-auto"
                        controls
                        width="100%"
                        style={{ marginTop: "10px" }}
                      >
                        <source
                          type="video/mp4"
                          src={URL.createObjectURL(videoFile)}
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Step 3 content */}
            <div className="mt-4 flex w-full flex-row justify-end">
              <button
                className=" mx-2 w-full rounded-md bg-brand-50 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  prevStep();
                }}
              >
                Previous
              </button>
              <button
                className=" mx-2 w-full rounded-md bg-brand-50 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
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
          <div className="w-full">
            <div className="w-full px-2">
              <div className="my-2 w-full">
                <label className="mb-2 block text-sm font-bold">State</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Add state"
                  className="w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <input
                  className="mr-2 flex w-2/3  rounded border border-gray-300 p-2"
                  type="text"
                  placeholder="Enter address..."
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                />

                <button
                  type="button"
                  className="border-transparent inline-flex items-center rounded-md border bg-brand-50 px-3 py-2 text-sm font-medium text-white hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-50 focus:ring-offset-2"
                  onClick={(e) => handleSearch(e)}
                >
                  Add Address
                </button>
              </div>
            </div>
            <div className="mt-4 flex w-full flex-row justify-end">
              <button
                className=" mx-2 w-full rounded-md bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  prevStep();
                }}
              >
                Previous
              </button>
              <button
                className="mx-2 w-full rounded-md bg-brand-50 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
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
      {loading ? (
        <div className="mt-10 flex h-full items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
        </div>
      ) : (
        <>
          <Card extra={"w-full h-full my-4 p-4 sm:overflow-x-auto"}>
            {companyData === null ? (
              <div className="relative flex justify-between">
                <div className="text-xl font-bold text-navy-700 dark:text-white"></div>
                <button
                  onClick={() => setIsAddCompanyOpen(true)}
                  className="mr-4 mt-4 rounded-md bg-brand-50 px-4 py-2 text-white"
                >
                  Add Details
                </button>
              </div>
            ) : (
              <div className="my-8 h-full overflow-x-scroll xl:overflow-hidden">
                <UpdateCompanyDetails />
              </div>
            )}
          </Card>

          {/* Add Details Modal */}
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
                      {addLoading ? (
                        <div className="mt-2 flex h-full items-center justify-center">
                          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
                        </div>
                      ) : (
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
                                            ? "border-l-4 border-brand-50"
                                            : "border-l-4 border-gray-200"
                                        } w-full py-2 pl-4 text-left md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4`}
                                      >
                                        <div className="flex flex-col text-left">
                                          <span
                                            className={`text-xs font-medium ${
                                              stepItem.status === "upcoming"
                                                ? "text-gray-500"
                                                : "text-brand-50"
                                            }`}
                                          >
                                            {stepItem.id}
                                          </span>
                                          <span
                                            className={`text-xs font-medium ${
                                              stepItem.status === "upcoming"
                                                ? "text-gray-500"
                                                : "text-brand-50"
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
                      )}
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Transition>
        </>
      )}
    </>
  );
};

export default AddCompanyDetails;
