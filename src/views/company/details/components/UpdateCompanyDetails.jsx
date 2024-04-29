import React, { useState, useEffect } from "react";
import { getCompanyDetails, updateCompanyDetails } from "api/company/details";
import { FaVideo } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateCompanyDetails = () => {
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [detailsId, setDetailsId] = useState(null);
  const navigate = useNavigate();

  const [companyData, setCompanyData] = useState({
    companyDetailsId: "",
    title: "",
    subTitle: "",
    companyName: "",
    address: {
      address: "",
      states: "",
      longitude: "",
      latitude: "",
    },
    image: "",
    coverImage:"",
    video: "",
    description: "",
    topRated: false,
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("jwttoken");
        const response = await getCompanyDetails(token);
        setDetailsId(response.data.data._id);
        setCompanyData(response.data.data);
        console.log(companyData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      if (companyData.address.address.trim() !== "") {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            companyData.address.address
          )}.json?access_token=pk.eyJ1IjoibWFhemtoYWxpZGJoYXR0aSIsImEiOiJjbHFkcTd1NDkwZnRiMmpwandzdTNuZHZjIn0.ng3u6jqasoaJJRa3NnHUIA`
        );
        const firstFeature = response.data.features[0];

        if (firstFeature) {
          setCompanyData((prevData) => ({
            ...prevData,
            address: {
              ...prevData.address,
              latitude: response.data.features[0].geometry.coordinates[1],
              longitude: response.data.features[0].geometry.coordinates[0],
              address: firstFeature?.place_name,
            },
          }));
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setCompanyData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
      address: {
        ...prevData.address,
        states: name === "state" ? value : prevData.address.states,
        address: name === "address" ? value : prevData.address.address,
      },
    }));
    console.log(companyData);
  };

  console.log(companyData.video);

  const [videoName, setVideoName] = useState("");
  const handleVideoChange = (e) => {
    const file = e.target.files[0];

    setCompanyData((prevData) => ({
      ...prevData,
      video: file,
    }));

    setVideoName(file.name);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setCompanyData((prevData) => ({
          ...prevData,
          image: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setCompanyData((prevData) => ({
          ...prevData,
          coverImage: reader.result,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+([a-z]{2,})+(\S+)?$/i;

  const handleUpdate = async () => {
    try {
      if (!companyData.facebook || !urlRegex.test(companyData.facebook)) {
        toast.warn("Please enter a valid Facebook URL");
        return;
      } else if (!companyData.twitter || !urlRegex.test(companyData.twitter)) {
        toast.warn("Please enter a valid Twitter URL");
        return;
      } else if (
        !companyData.instagram ||
        !urlRegex.test(companyData.instagram)
      ) {
        toast.warn("Please enter a valid Instagram URL");
        return;
      }

      setUpdateLoading(true);
      console.log(companyData);
      const dataToSend = {
        video: companyData.video,
        body: JSON.stringify({
          companyDetailsId: detailsId,
          title: companyData.title,
          subTitle: companyData.subTitle,
          companyName: companyData.companyName,
          address: {
            address: companyData.address.address,
            states: companyData.address.states,
            longitude: companyData.address.longitude,
            latitude: companyData.address.latitude,
          },
          image: companyData.image,
          coverImage: companyData.coverImage,
          video: companyData.video,
          description: companyData.description,
          topRated: companyData.topRated,
          facebook: companyData.facebook,
          twitter: companyData.twitter,
          instagram: companyData.instagram,
          linkedin: companyData.linkedin,
        }),
      };
      console.log("ddddcddddd", dataToSend);

      const response = await updateCompanyDetails(dataToSend);
      console.log(response.data);
      toast.success(response.data.message);
      window.location.reload();
    } catch (error) {
      if (error.response.data.message === "Your Image is too Big") {
        toast.error("please select small Image.");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
        </div>
      ) : (
        companyData && (
          <div className="w-full">
            {updateLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
              </div>
            ) : (
              <form className="w-full">
                <div>
                  <div className="flex w-full flex-row items-center">
                    <div className="mt-2 w-full px-2 sm:w-1/2">
                      <label className="mb-2 block text-sm font-bold">
                        Company Name
                      </label>
                      <input
                        name="companyName"
                        placeholder="Company Name"
                        className="w-full rounded-md border border-gray-300 p-2"
                        value={companyData.companyName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mt-2 w-full px-2 sm:w-1/2">
                      <label className="mb-2 block text-sm font-bold">
                        State
                      </label>
                      <input
                        name="state"
                        placeholder="enter address"
                        className="w-full rounded-md border border-gray-300 p-2"
                        value={companyData.address.states}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <label className="mx-2 my-2 block text-sm font-bold">
                  Add Address (
                  <span className="textxs font-normal">
                    Please Click on add address button when you change it here.
                  </span>
                  )
                </label>
                <div className="flex w-full flex-row items-center justify-between px-2">
                  <input
                    className="mr-2 flex w-2/3  rounded border border-gray-300 p-2"
                    type="text"
                    placeholder="Enter address..."
                    name="address"
                    value={companyData.address.address}
                    onChange={(e) => handleChange(e)}
                  />

                  <button
                    type="button"
                    className="border-transparent inline-flex items-center rounded-md border bg-brand-50 px-3 py-2 text-sm font-medium text-white hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-50 focus:ring-offset-2"
                    onClick={(e) => handleSearch(e)}
                  >
                    Add Address
                  </button>
                </div>

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
                        value={companyData.facebook}
                        onChange={handleChange}
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
                        value={companyData.twitter}
                        onChange={handleChange}
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
                        value={companyData.instagram}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mt-2 w-full px-2 sm:w-1/2">
                      <label className="mb-2 block text-sm font-bold">
                        LinkedIn
                      </label>
                      <input
                        name="linkedin"
                        placeholder="linkedIn url"
                        className="w-full rounded-md border border-gray-300 p-2"
                        value={companyData.linkedin}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  {/* Image and Video url Links */}
                  <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-3">
                    <div className=" ">
                      <label className="mb-2 block text-sm font-bold">
                        Image
                      </label>

                      <div className="relative mb-2 rounded-lg border border-dashed border-gray-300 p-4 text-center">
                        <label
                          htmlFor="companyImage"
                          className="block text-sm font-medium text-gray-600"
                        >
                          <MdFileUpload className="mx-auto mb-2 text-[80px] text-brand-50 dark:text-white" />
                          Click to upload Image
                          <input
                            className="hidden"
                            id="companyImage"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                      <div className="flex items-center justify-center">
                        {companyData.image && (
                          <img
                            className="h-[20vh] w-auto"
                            src={companyData.image}
                            alt="SelectedImage"
                            style={{ maxWidth: "100%", marginTop: "10px" }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="">
                      <label className="mb-2 block text-sm font-bold">
                        cover Image
                      </label>

                      <div className="relative mb-2 rounded-lg border border-dashed border-gray-300 p-4 text-center">
                        <label
                          htmlFor="coverImage"
                          className="block text-sm font-medium text-gray-600"
                        >
                          <MdFileUpload className="mx-auto mb-2 text-[80px] text-brand-50 dark:text-white" />
                          Click to upload cover Image
                          <input
                            className="hidden"
                            id="coverImage"
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                          />
                        </label>
                      </div>
                      <div className="flex items-center justify-center">
                        {companyData.coverImage && (
                          <img
                            className="h-[20vh] w-auto"
                            src={companyData.coverImage}
                            alt="SelectedCoverImage"
                            style={{ maxWidth: "100%", marginTop: "10px" }}
                          />
                        )}
                      </div>
                    </div>


                    <div className="">
                      <label className="mb-2 block text-sm font-bold">
                        Video
                      </label>

                      <div className="relative mb-2 rounded-lg border border-dashed border-gray-300 p-4 text-center">
                        <label
                          htmlFor="Video"
                          className="block text-sm font-medium text-gray-600"
                        >
                          <FaVideo className="mx-auto mb-2 text-[80px] text-brand-50 dark:text-white" />
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
                            className="hidden"
                            id="Video"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                          />
                        </label>
                      </div>
                      <div className="flex items-center justify-center">
                        {companyData.video && (
                          <video
                            className="h-[20vh] w-auto"
                            controls
                            width="100%"
                            style={{ marginTop: "10px" }}
                          >
                            <source type="video/mp4" src={companyData.video} />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex w-full items-center justify-center">
                  <button
                    type="button"
                    className=" mt-4 rounded-md bg-brand-50 px-4 py-2 text-white"
                    onClick={handleUpdate}
                  >
                    Update Company Details
                  </button>
                </div>
              </form>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default UpdateCompanyDetails;
