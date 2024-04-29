import React, { useState } from "react";

const CompanyForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    companyName: "",
    address: {
      states: "",
      longitude: "",
      latitude: "",
    },
    coverImage: null,
    profileImage: null,
    video: null,
    description: "",
    topRated: false,
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",

    occupationName: "",
    occupationdescription: "",
    occupationVideo: null,
    occupationlocations: {
      longitude: "",
      latitude: "",
      testerDays: [
        {
          startDate: "",
          endDate: "",
          startDuration: "",
          endDuration: "",
        },
      ],
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleNestedChange = (parent, key, value) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [key]: value,
      },
    });
  };

  const handleTesterDaysChange = (index, key, value) => {
    setFormData({
      ...formData,
      occupationlocations: {
        ...formData.occupationlocations,
        testerDays: formData.occupationlocations.testerDays.map((day, i) =>
          i === index ? { ...day, [key]: value } : day
        ),
      },
    });
  };

  const handleAddTesterDay = () => {
    setFormData({
      ...formData,
      occupationlocations: {
        ...formData.occupationlocations,
        testerDays: [
          ...formData.occupationlocations.testerDays,
          {
            startDate: "",
            endDate: "",
            startDuration: "",
            endDuration: "",
          },
        ],
      },
    });
  };

  const handleRemoveTesterDay = (index) => {
    setFormData({
      ...formData,
      occupationlocations: {
        ...formData.occupationlocations,
        testerDays: formData.occupationlocations.testerDays.filter(
          (day, i) => i !== index
        ),
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container mx-auto mt-8">
      <form onSubmit={handleSubmit}>
        {/* Title, Subtitle, Company Name */}
        <div className="flex flex-wrap">
          <div className=" flex w-full flex-col p-1 sm:w-1/2 lg:w-1/3">
            <label>company Title</label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="w-full border border-gray-300 p-2"
            />
          </div>
          <div className=" flex w-full flex-col p-1 sm:w-1/2 lg:w-1/3">
            <label>company Subtitle</label>

            <input
              type="text"
              name="Company Subtitle"
              value={formData.subTitle}
              onChange={handleChange}
              placeholder="Subtitle"
              className="w-full border  border-gray-300 p-2"
            />
          </div>
          <div className=" flex w-full flex-col p-1 sm:w-1/2 lg:w-1/3">
            <label>company name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full border border-gray-300 p-2"
            />
          </div>
        </div>

        <div className="mb-4 flex">
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company Name"
            className="ml-2 border border-gray-300 p-2"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <input
            type="text"
            name="address.states"
            value={formData.address.states}
            onChange={(e) =>
              handleNestedChange("address", "states", e.target.value)
            }
            placeholder="State"
            className="border border-gray-300 p-2"
          />
          <input
            type="text"
            name="address.latitude"
            value={formData.address.latitude}
            onChange={(e) =>
              handleNestedChange("address", "latitude", e.target.value)
            }
            placeholder="Latitude"
            className="ml-2 border border-gray-300 p-2"
          />
          <input
            type="text"
            name="address.longitude"
            value={formData.address.longitude}
            onChange={(e) =>
              handleNestedChange("address", "longitude", e.target.value)
            }
            placeholder="Longitude"
            className="ml-2 border border-gray-300 p-2"
          />
        </div>

        {/* Cover Image */}
        <div className="mb-4">
          <input
            type="file"
            name="coverImage"
            onChange={handleFileChange}
            className="border border-gray-300 p-2"
          />
        </div>

        {/* Profile Image */}
        <div className="mb-4">
          <input
            type="file"
            name="profileImage"
            onChange={handleFileChange}
            className="border border-gray-300 p-2"
          />
        </div>

        {/* Video */}
        <div className="mb-4">
          <input
            type="file"
            name="video"
            onChange={handleFileChange}
            className="border border-gray-300 p-2"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border border-gray-300 p-2"
          />
        </div>

        {/* Top Rated */}
        {/* <div className="mb-4">
          <label>
            <input
              type="checkbox"
              name="topRated"
              checked={formData.topRated}
              onChange={(e) =>
                setFormData({ ...formData, topRated: e.target.checked })
              }
            />
            Top Rated
          </label>
        </div> */}

        {/* Social Media Links */}
        <div className="mb-4 flex">
          <input
            type="text"
            name="facebook"
            value={formData.facebook}
            onChange={handleChange}
            placeholder="Facebook URL"
            className="mr-2 border border-gray-300 p-2"
          />
          <input
            type="text"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            placeholder="Twitter URL"
            className="mr-2 border border-gray-300 p-2"
          />
          <input
            type="text"
            name="instagram"
            value={formData.instagram}
            onChange={handleChange}
            placeholder="Instagram URL"
            className="mr-2 border border-gray-300 p-2"
          />
          <input
            type="text"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            className="ml-2 border border-gray-300 p-2"
          />
        </div>

        {/* Occupation Fields */}
        <div className="mb-4">
          <input
            type="text"
            name="occupationName"
            value={formData.occupationName}
            onChange={handleChange}
            placeholder="Occupation Name"
            className="border border-gray-300 p-2"
          />
          <textarea
            name="occupationdescription"
            value={formData.occupationdescription}
            onChange={handleChange}
            placeholder="Occupation Description"
            className="ml-2 border border-gray-300 p-2"
          />
          <input
            type="file"
            name="occupationVideo"
            onChange={handleFileChange}
            className="ml-2 border border-gray-300 p-2"
          />
        </div>

        {/* Occupation Locations */}
        <div className="mb-4">
          <input
            type="text"
            name="occupationlocations.latitude"
            value={formData.occupationlocations.latitude}
            onChange={(e) =>
              handleNestedChange(
                "occupationlocations",
                "latitude",
                e.target.value
              )
            }
            placeholder="Occupation Latitude"
            className="mr-2 border border-gray-300 p-2"
          />
          <input
            type="text"
            name="occupationlocations.longitude"
            value={formData.occupationlocations.longitude}
            onChange={(e) =>
              handleNestedChange(
                "occupationlocations",
                "longitude",
                e.target.value
              )
            }
            placeholder="Occupation Longitude"
            className="ml-2 border border-gray-300 p-2"
          />
        </div>

        {/* Tester Days */}
        {formData.occupationlocations.testerDays.map((day, index) => (
          <div key={index} className="mb-4">
            <input
              type="date"
              name={`occupationlocations.testerDays[${index}].startDate`}
              value={day.startDate}
              onChange={(e) =>
                handleTesterDaysChange(index, "startDate", e.target.value)
              }
              placeholder="Start Date"
              className="border border-gray-300 p-2"
            />
            <input
              type="date"
              name={`occupationlocations.testerDays[${index}].endDate`}
              value={day.endDate}
              onChange={(e) =>
                handleTesterDaysChange(index, "endDate", e.target.value)
              }
              placeholder="End Date"
              className="ml-2 border border-gray-300 p-2"
            />
            <input
              type="time"
              name={`occupationlocations.testerDays[${index}].startDuration`}
              value={day.startDuration}
              onChange={(e) =>
                handleTesterDaysChange(index, "startDuration", e.target.value)
              }
              placeholder="Start Duration"
              className="ml-2 border border-gray-300 p-2"
            />
            <input
              type="time"
              name={`occupationlocations.testerDays[${index}].endDuration`}
              value={day.endDuration}
              onChange={(e) =>
                handleTesterDaysChange(index, "endDuration", e.target.value)
              }
              placeholder="End Duration"
              className="ml-2 border border-gray-300 p-2"
            />
            <button
              type="button"
              onClick={() => handleRemoveTesterDay(index)}
              className="ml-2 rounded bg-red-500 p-2 text-white"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddTesterDay}
          className="mb-4 rounded bg-green-500 p-2 text-white"
        >
          Add Tester Day
        </button>

        {/* Add More Fields as Needed */}

        {/* Submit Button */}
        <button type="submit" className="rounded bg-blue-500 p-2 text-white">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CompanyForm;
