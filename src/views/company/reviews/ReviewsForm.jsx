import Card from "components/card";
import React, { useEffect, useState } from "react";
import { getAppointments } from "api/company/appointments";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { finishAppointment } from "api/company/appointments";
import { getAppointmentsCompanyUser } from "api/company/appointments";

const ReviewsForm = () => {
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [ReviewModal, setReviewModal] = useState(false);
  const [appointmentIdToReview, setAppointmentIdToReview] = useState(null);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  useEffect(() => {
    const companyId = localStorage.getItem("id");
    const token = localStorage.getItem("jwttoken");
    const adminType = localStorage.getItem("adminType");

    if (adminType === "company") {
      const fetchAppointments = async () => {
        try {
          const response = await getAppointments(companyId, token);
          setAppointments(response.data.data);
          console.log(response.data.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          setLoading(false);
        }
      };
      fetchAppointments();
    } else if (adminType === "companyUser") {
      const fetchAppointments = async () => {
        try {
          const response = await getAppointmentsCompanyUser(companyId, token);
          setAppointments(response.data.data);
          console.log(response.data.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching appointments:", error);
          setLoading(false);
        }
      };
      fetchAppointments();
    }
  }, []);

  const handleReview = (appointmentId) => {
    setReviewModal(true);
    setAppointmentIdToReview(appointmentId);
  };

  const confirmReview = async () => {
    const companyId = localStorage.getItem("id");
    const token = localStorage.getItem("jwttoken");
    const adminType = localStorage.getItem("adminType");
    try {
      setReviewLoading(true);
      if (!rating) {
        toast.warn("Add Rating Please.");
        return;
      }
      if (!reviewText) {
        toast.warn("Write Review Please.");
        return;
      }
      if (appointmentIdToReview) {
        const response = await finishAppointment(
          appointmentIdToReview,
          rating,
          reviewText
        );
        console.log(response);
        if (response.data.status === 200) {
          toast.success("review Added Successfully.");
          setReviewText("");
          setRating(0);
          setReviewLoading(false);
        }
        if (adminType === "company") {
          const updatedAppointments = await getAppointments(companyId, token);
          setAppointments(updatedAppointments.data.data);
        } else if (adminType === "companyUser") {
          const updatedAppointments = await getAppointmentsCompanyUser(
            companyId,
            token
          );
          setAppointments(updatedAppointments.data.data);
        }
      }

      setReviewModal(false);
    } catch (error) {
      console.error("Error approving appointment:", error);
      setReviewModal(false);
    } finally {
      setReviewLoading(false);
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
            <div className="w-full">
              <div className="mt-8 h-full overflow-x-scroll xl:overflow-hidden">
                <div className="max-h-[80vh] overflow-y-auto">
                  <table className="w-full whitespace-nowrap text-center">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                          #
                        </th>
                        <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                          Name
                        </th>
                        <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                          Email
                        </th>
                        <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                          Type
                        </th>
                        <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-brand-50 dark:!border-navy-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments
                        .filter(
                          (appointment) =>
                            appointment.isApproved === true &&
                            appointment.isFinished === false &&
                            appointment.isReject === false
                        )
                        .map((approvedAppointment, index) => (
                          <tr key={approvedAppointment._id} className="">
                            <td className="pb-4 pt-4 sm:text-base">
                              <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                                <li className="m-2 w-full rounded  p-2 shadow-md">
                                  {index + 1}
                                </li>
                              </ul>
                            </td>
                            <td className="pb-4 pt-4 sm:text-base">
                              <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                                <li className="m-2 w-full rounded p-2 shadow-md">
                                  {approvedAppointment.firstName}{" "}
                                  {approvedAppointment.lastName}
                                </li>
                              </ul>
                            </td>
                            <td className="pb-4 pt-4 sm:text-base">
                              <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                                <li className="m-2 w-full rounded  p-2 shadow-md">
                                  {approvedAppointment.email}
                                </li>
                              </ul>
                            </td>
                            <td className="pb-4 pt-4 sm:text-base">
                              <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                                <li className="m-2 w-full rounded bg-brand-50 p-2 text-white shadow-md">
                                  Approved
                                </li>
                              </ul>
                            </td>
                            <td className="pb-4 pt-4 sm:text-base">
                              <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                                <button
                                  onClick={() =>
                                    handleReview(approvedAppointment._id)
                                  }
                                  className="m-2 w-full rounded-full bg-blue-400 p-2 shadow-2xl transition-all duration-300 ease-in-out hover:bg-brand-50 hover:text-white"
                                >
                                  Write Review
                                </button>
                              </ul>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>

      <Transition show={ReviewModal} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setReviewModal(false)}
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

            {/* This element is to trick the browser into centering the modal contents. */}
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
              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  {reviewLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto ">
                        <h2 className="mb-4 text-2xl font-semibold">
                          Leave a Review
                        </h2>

                        <div className="mb-4">
                          <label
                            htmlFor="rating"
                            className="block text-sm font-medium text-gray-600"
                          >
                            Rating
                          </label>
                          <div className="flex items-center">
                            {[...Array(10)].map((_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleRatingChange(index + 1)}
                                className={`focus:shadow-outline mx-1 flex h-8 w-8 items-center justify-center rounded-full text-sm focus:outline-none sm:h-8 sm:w-8 ${
                                  index + 1 <= rating
                                    ? "bg-yellow-500"
                                    : "bg-gray-300"
                                }`}
                              >
                                {index + 1}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="reviewText"
                            className="block text-sm font-medium text-gray-600"
                          >
                            Review
                          </label>
                          <textarea
                            id="reviewText"
                            name="reviewText"
                            rows="4"
                            value={reviewText}
                            onChange={handleReviewTextChange}
                            className="mt-1 w-full rounded-md border border-gray-400 p-2"
                          ></textarea>
                        </div>

                        <div className="flex flex-row items-center justify-end">
                          <button
                            onClick={confirmReview}
                            className="focus:shadow-outline-blue rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
                          >
                            Submit Review
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ReviewsForm;
