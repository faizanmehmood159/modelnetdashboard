import React, { useEffect, useState } from "react";
import Card from "components/card";
import { BsSearch } from "react-icons/bs";
import { getFinishedAppointments } from "api/company/appointments";
import { toast } from "react-toastify";
import { getFinishedAppointmentsLocation } from "api/company/appointments";
import axios from "axios";
import { getAllFinishedAppointments } from "api/company/appointments";

const FinishedAppointments = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState("");
  const [selectedAppointments, setSelectedAppointments] = useState([]);

  const handleCheckboxChange = (appointmentId) => {
    const isSelected = selectedAppointments.includes(appointmentId);

    if (isSelected) {
      setSelectedAppointments((prevSelected) =>
        prevSelected.filter((id) => id !== appointmentId)
      );
    } else {
      setSelectedAppointments((prevSelected) => [
        ...prevSelected,
        appointmentId,
      ]);
    }
  };

  const exportSelectedToExcel = () => {
    const selectedAppointmentsData = appointments.filter((appointment, index) =>
      selectedAppointments.includes(index)
    );

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Job Category,Start Date,Rating,User Name,User Email,Review,Address\n" +
      selectedAppointmentsData
        .map((appointment, index) => {
          const startDate = new Date(appointment.createdAt).toLocaleDateString(
            "en-US"
          );
          const rating = appointment.rating;
          const address = addresses[index] || "Address not found";
          const userName = appointment.firstName + appointment.lastName;
          const userEmail = appointment.email;
          const review = appointment.feedback;

          return `${appointment.category},${startDate},${rating},${userName},${userEmail},${review},"${address}"`;
        })
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_appointments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const addresses = await Promise.all(
          appointments?.map(async (appointment) => {
            const { coordinates } = appointment.occupationlocation;
            const response = await axios.get(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=pk.eyJ1IjoibWFhemtoYWxpZGJoYXR0aSIsImEiOiJjbHFkcTd1NDkwZnRiMmpwandzdTNuZHZjIn0.ng3u6jqasoaJJRa3NnHUIA`
            );

            const firstFeature = response.data.features[0];
            return firstFeature ? firstFeature.place_name : "Address not found";
          })
        );

        setAddresses(addresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setAddresses(Array(appointments.length).fill("Error fetching address"));
      }
    };
    fetchData();
  }, [appointments]);

  useEffect(() => {
    if (selectedOption === "location") {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              address
            )}.json?access_token=pk.eyJ1IjoibWFhemtoYWxpZGJoYXR0aSIsImEiOiJjbHFkcTd1NDkwZnRiMmpwandzdTNuZHZjIn0.ng3u6jqasoaJJRa3NnHUIA`
          );
          const firstFeature = response.data.features[0];

          if (firstFeature) {
            setLatitude(firstFeature.center[1]);
            setLongitude(firstFeature.center[0]);
          } else {
            console.log("Location not found.");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      };

      fetchData();
    }
  }, [address]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwttoken");
      try {
        const response = await getAllFinishedAppointments(token);
        setAppointments(response.data.data);
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchData();
  }, []);
  console.log(appointments);

  useEffect(() => {
    setSearchValue("");
    setAppointments("");
  }, [selectedOption]);

  const handleSearch = async () => {
    console.log("VVVVVVVVVVVVVVV", searchValue);
    if (selectedOption === "location") {
      try {
        if (searchValue === "") {
          toast.warn("please enter search value");
          return;
        }
        setAddress(searchValue);
        setLoading(true);
        const token = localStorage.getItem("jwttoken");
        const response = await getFinishedAppointmentsLocation(
          longitude,
          latitude,
          token
        );

        if (response.status === 200) {
          toast.success(response.data.messsage);
          setAppointments(response.data.data);

          if (response.data.data.length > 0) {
            const firstAppointment = response.data.data[0];
            const long = firstAppointment.occupationlocation.coordinates[0];
            const lat = firstAppointment.occupationlocation.coordinates[1];
            setLongitude(long);
            setLatitude(lat);
          }

          setLoading(false);
          setSearchValue("");
        }
      } catch (error) {
        console.error(error.response);
        toast.error(error.response.data.message);
        setAppointments([]);
        setSearchValue("");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        if (searchValue === "") {
          toast.warn("please enter search value");
          return;
        }
        setAddress(searchValue);
        setLoading(true);
        const token = localStorage.getItem("jwttoken");
        const response = await getFinishedAppointments(
          selectedOption,
          searchValue,
          token
        );

        if (response.status === 200) {
          toast.success(response.data.messsage);
          setAppointments(response.data.data);
          setLoading(false);
          setSearchValue("");
        }
      } catch (error) {
        console.error(error.response);
        toast.error(error.response.data.message);
        setAppointments([]);
        setSearchValue("");
      } finally {
        setLoading(false);
      }
    }
  };

  const exportToExcel = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Job Category,Start Date,Rating,User Name,User Email, Review,Address\n" +
      appointments
        .map((appointment, index) => {
          const startDate = new Date(appointment.createdAt).toLocaleDateString(
            "en-US"
          );
          const rating = appointment.rating;
          const address = addresses[index] || "Address not found";
          const userName = appointment.firstName + appointment.lastName;
          const userEmail = appointment.email;
          const review = appointment.feedback;

          return `${appointment.category},${startDate},${rating},${userName},${userEmail},${review},"${address}"`;
        })
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "finished_appointments.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full w-full">
      <Card extra={"w-full h-full my-6 p-4 sm:overflow-x-auto"}>
        <>
          <div className="mb-4 flex flex-col items-center justify-between sm:flex-row">
            <div className="mb-2 sm:mb-0"></div>
            <div className="mb-2 sm:mb-0">
              <button
                onClick={exportSelectedToExcel}
                className="m-4 rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-50"
              >
                Export Selected to Excel
              </button>
              <button
                onClick={exportToExcel}
                className="m-4 rounded-md bg-brand-500 px-4 py-2 text-white hover:bg-brand-50"
              >
                Export All Excel
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="selectBox"
                className="block text-sm font-medium text-brand-50"
              >
                Select Any Option
              </label>
              <div className="relative mt-2 flex items-center">
                <select
                  id="selectBox"
                  name="selectBox"
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="placeholder:text-black-400 block w-full rounded-md border-0 px-4 py-1.5 pr-10 text-brand-50 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="location">Location</option>
                  <option value="category">Category</option>
                  {localStorage.getItem("adminType") === "company" && (
                    <option value="companyUserEmail">Company Email</option>
                  )}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-brand-50"
              >
                Job, Location, Category, or Email
              </label>
              <div className="relative mt-2 flex items-center">
                <input
                  type="text"
                  name="search"
                  placeholder="Job Category, Location, Company, or User Email"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  id="search"
                  className="placeholder:text-black-400 block w-full rounded-md border-0 px-4 py-1.5 pr-10 text-brand-50 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className="absolute inset-y-0 right-0 flex items-center bg-brand-500 px-3">
                  <button className="text-white" onClick={handleSearch}>
                    <BsSearch color="white" />{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}

          {loading ? (
            <div className="mt-20 flex h-full items-center justify-center">
              <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
            </div>
          ) : (
            <>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full whitespace-nowrap text-center">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700"></th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                        #
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                        Job Category
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                        Location
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                        Start Date
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                        Rating
                      </th>

                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                        Responsible User
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                        User Name
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                        User Email
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                        Review
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(appointments) && appointments.length > 0 ? (
                      appointments?.map((appointment, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedAppointments.includes(index)}
                              onChange={() => handleCheckboxChange(index)}
                            />
                          </td>
                          <td>
                            {" "}
                            <div className="m-2 rounded-md bg-white p-2 shadow-md">
                              {index + 1}
                            </div>
                          </td>
                          <td>
                            <div className="m-2 rounded-md bg-white p-2 shadow-md">
                              {appointment.category}
                            </div>
                          </td>
                          <td>
                            <div className="m-2 rounded-md bg-white p-2 shadow-md">
                              {addresses[index] || "Address not found"}
                            </div>
                          </td>
                          <td>
                            <div className="m-2 rounded-md bg-white p-2 shadow-md">
                              {new Date(
                                appointment.createdAt
                              ).toLocaleDateString("en-US")}
                            </div>
                          </td>
                          <td>
                            <div className="m-2 rounded-md bg-white p-2 shadow-md">
                              {appointment.rating}
                            </div>
                          </td>
                          <td>
                            <div className="m-2 rounded-md bg-white p-2 shadow-md">
                              {appointment.companyUserEmail}
                            </div>
                          </td>
                          <td>
                            <div className="m-2 rounded-md bg-white p-2 shadow-md">
                              {appointment?.firstName} {appointment?.lastName}
                            </div>
                          </td>
                          <td>
                            <div className="m-2 rounded-md bg-white p-2 shadow-md">
                              {appointment?.email}
                            </div>
                          </td>
                          <td>
                            <div className="m-2 rounded-md bg-white p-2 shadow-md">
                              {appointment?.feedback}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6 w-full flex items-center justify-center">
                          <p>No appointments found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      </Card>
    </div>
  );
};

export default FinishedAppointments;
