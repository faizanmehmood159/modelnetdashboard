import React, { useEffect, useState } from "react";
import { getAppointments } from "api/company/appointments";
import Card from "components/card";
import { Dialog, Transition } from "@headlessui/react";
import { approveAppintments } from "api/company/appointments";
import { toast } from "react-toastify";
import { rejectAppointment } from "api/company/appointments";
import { getAppointmentsCompanyUser } from "api/company/appointments";

const AppointmentsForm = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [appointmentIdToApprove, setAppointmentIdToApprove] = useState(null);
  const [appointmentIdToReject, setAppointmentIdToReject] = useState(null);

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

  const handleApprove = (appointmentId) => {
    setApproveModal(true);
    setAppointmentIdToApprove(appointmentId);
  };
  const handleReject = (appointmentId) => {
    setRejectModal(true);
    setAppointmentIdToReject(appointmentId);
  };

  const confirmApprove = async () => {
    const companyId = localStorage.getItem("id");
    const token = localStorage.getItem("jwttoken");
    const adminType = localStorage.getItem("adminType");
    try {
      setApproveLoading(true);
      if (appointmentIdToApprove) {
        const response = await approveAppintments(appointmentIdToApprove);
        if (response.data.status === 200) {
          toast.success(response.data.message);
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

      setApproveModal(false);
    } catch (error) {
      console.error("Error approving appointment:", error);
      setApproveModal(false);
    } finally {
      setApproveLoading(false);
    }
  };

  const confirmReject = async () => {
    const companyId = localStorage.getItem("id");
    const token = localStorage.getItem("jwttoken");
    const adminType = localStorage.getItem("adminType");
    try {
      setApproveLoading(true);
      if (appointmentIdToReject) {
        const response = await rejectAppointment(appointmentIdToReject);
        console.log(response.data);
        if (response.data.status === 200) {
          toast.success(response.data.message);
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

      setRejectModal(false);
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      setRejectModal(false);
    } finally {
      setApproveLoading(false);
    }
  };

  return (
    <>
      <Card extra={"w-full h-full my-6 p-4 sm:overflow-x-auto"}>
        <div className="mt-6 flex space-x-4 overflow-hidden overflow-x-auto">
          <button
            className={`${
              activeTab === "pending" ? "bg-blue-500 text-white" : "bg-gray-300"
            } rounded px-4 py-2`}
            onClick={() => handleTabClick("pending")}
          >
            Pending
          </button>
          <button
            className={`${
              activeTab === "approved"
                ? "bg-green-500 text-white"
                : "bg-gray-300"
            } rounded px-4 py-2`}
            onClick={() => handleTabClick("approved")}
          >
            Approved
          </button>
          <button
            className={`${
              activeTab === "rejected" ? "bg-red-500 text-white" : "bg-gray-300"
            } rounded px-4 py-2`}
            onClick={() => handleTabClick("rejected")}
          >
            Rejected
          </button>
        </div>
        {activeTab === "pending" && (
          <div className="container mx-auto mt-8">
            <div className="text-2xl font-semibold">
              <h1 className="rounded border border-b-blue-400 bg-brand-50 p-2 px-4 py-2 text-center text-white">
                Pending
              </h1>
            </div>
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
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              #
                            </th>
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              Name
                            </th>
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              Email
                            </th>
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              Applied Date
                            </th>
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              Deadline
                            </th>

                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments
                            .filter(
                              (appointment) => appointment.pending === true
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
                                    <li className="bg-grey-700 m-2 w-full rounded p-2 shadow-md">
                                      {new Date(
                                        approvedAppointment.createdAt
                                      ).toLocaleDateString()}
                                    </li>
                                  </ul>
                                </td>
                                <td className="pb-4 pt-4 sm:text-base">
                                  <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                                    <li className="m-2 w-full rounded bg-red-600 p-2 text-white shadow-md">
                                      {new Date(
                                        approvedAppointment.deadline
                                      ).toLocaleDateString()}
                                    </li>
                                  </ul>
                                </td>

                                <td className="pb-4 pt-4 sm:text-base">
                                  <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                                    <button
                                      onClick={() =>
                                        handleApprove(approvedAppointment._id)
                                      }
                                      className="m-2 w-full rounded-full bg-green-500 p-2 text-white shadow-2xl transition-all duration-300 ease-in-out hover:bg-green-700 hover:text-white"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleReject(approvedAppointment._id)
                                      }
                                      className="m-2 w-full rounded-full bg-red-600 p-2 text-white shadow-2xl transition-all duration-300 ease-in-out hover:bg-red-700 hover:text-white"
                                    >
                                      Reject
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
          </div>
        )}

        {activeTab === "approved" && (
          <div className="container mx-auto mt-8">
            <div className=" text-2xl font-semibold">
              <h1 className="rounded border border-b-green-400 bg-brand-50 p-2 px-4 py-2 text-center text-white">
                Approved
              </h1>
            </div>
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
              </div>
            ) : (
              <>
                <div className="w-full">
                  <div className="mt-8 h-full overflow-x-scroll xl:overflow-hidden">
                    <div className="max-h-[80vh] overflow-y-auto">
                      <table className="w-full whitespace-nowrap text-center">
                        <thead>
                          <tr>
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              #
                            </th>
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              Name
                            </th>
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              Email
                            </th>
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              Type
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments
                            .filter(
                              (appointment) => appointment.isApproved === true
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
                                    <li className="m-2 w-full rounded bg-brand-50 p-2 text-center text-white shadow-md">
                                      Approved
                                    </li>
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
          </div>
        )}
        {activeTab === "rejected" && (
          <div className="container mx-auto mt-8">
            <div className=" text-2xl font-semibold">
              <h1 className="rounded border border-b-red-500 bg-brand-50 p-2 px-4 py-2 text-center text-white">
                Rejected
              </h1>
            </div>
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
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              #
                            </th>
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              Name
                            </th>
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              Email
                            </th>
                            <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                              Type
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments
                            .filter(
                              (appointment) => appointment.isReject === true
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
                                    <li className="m-2 w-full rounded bg-red-500 p-2 text-white shadow-md">
                                      Rejected
                                    </li>
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
          </div>
        )}
      </Card>

      {/* Modal for approve confirm */}
      <Transition show={approveModal} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setApproveModal(false)}
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
              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                {approveLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
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
                          >
                            Confirm Approval
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to approve this Appointment?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        onClick={confirmApprove}
                        type="button"
                        className="border-transparent inline-flex w-full justify-center rounded-md border bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => setApproveModal(false)}
                        type="button"
                        className="hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
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

      {/* Modal for Reject confirm */}
      <Transition show={rejectModal} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setRejectModal(false)}
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
              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                {approveLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg
                            className="h-6 w-6 text-red-600"
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
                          >
                            Confirm Reject
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to Reject this Appointment?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        onClick={confirmReject}
                        type="button"
                        className="border-transparent inline-flex w-full justify-center rounded-md border bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => setRejectModal(false)}
                        type="button"
                        className="hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
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
    </>
  );
};

export default AppointmentsForm;
