import Card from "components/card";
import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { FaRegThumbsUp } from "react-icons/fa";
import {
  BsEnvelopeFill,
  BsPhoneFill,
  BsQuestionCircleFill,
} from "react-icons/bs";
import { getAllComplaints } from "api/admin/complaints";

const DummyData = [
  {
    id: 1,
    name: "Ali",
    email: "ali@gmail.com",
    phone: "+9261526357634",
    complaint: "complaint text",
  },
  {
    id: 2,
    name: "Sara",
    email: "sara@example.com",
    phone: "+1234567890",
    complaint: "another complaint",
  },
  {
    id: 3,
    name: "John",
    email: "john@example.com",
    phone: "+9876543210",
    complaint: "more complaints",
  },
  {
    id: 4,
    name: "John",
    email: "john@example.com",
    phone: "+9876543210",
    complaint: "more complaints",
  },
  // Add more data items as needed
];
const ResolvedData = [
  {
    id: 1,
    name: "Ahmad",
    email: "Ahmad@gmail.com",
    phone: "+926153434535",
    complaint: "complaint text",
  },
];

const Complaints = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [rejectCompanyId, setRejectCompanyId] = useState(null);
  const [complaints, setComplaints] = useState([]);

  const [selectedDeleteCompanyId, setSelectedDeleteCompanyId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllComplaints();
        console.log(complaints);
        setComplaints(response.data.data.complaints);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (companyId) => {
    setSelectedCompanyId(companyId);
  };

  const handleReject = async (companyId) => {
    setRejectCompanyId(companyId);
  };

  const handleDelete = async (companyId) => {
    setSelectedDeleteCompanyId(companyId);
    console.log("delete console");
  };

  const confirmApprove = async () => {
    // try {
    //   const token = localStorage.getItem("jwttoken");

    //   await approveCompany(selectedCompanyId);
    //   setUnapprovedCompanies((prevCompanies) =>
    //     prevCompanies.filter((company) => company._id !== selectedCompanyId)
    //   );
    //   setSelectedCompanyId(null);
    //   const approvedResponse = await getApprovedPendingCompany(token);
    //   setApproved(approvedResponse.data.data);
    //   toast.success("Company approved successfully!");
    // } catch (error) {
    //   console.error(error.response.data.message);
    //   toast.error(error.response.data.message);
    // }
  };
  const confirmReject = async () => {
    // try {
    //   const token = localStorage.getItem("jwttoken");

    //   const response = await rejectCompany(rejectCompanyId);
    //   setUnapprovedCompanies((prevCompanies) =>
    //     prevCompanies.filter((company) => company._id !== rejectCompanyId)
    //   );
    //   console.log(response);
    //   setRejectCompanyId(null);
    //   const approvedResponse = await getApprovedPendingCompany(token);
    //   setApproved(approvedResponse.data.data);
    //   toast.success("Company Rejected successfully!");
    // } catch (error) {
    //   console.error(error.response.data.message);
    //   toast.error(error.response.data.message);
    // }
  };

  const confirmDelete = async () => {
    // try {
    //   const token = localStorage.getItem("jwttoken");

    //   await deleteCompany(selectedDeleteCompanyId, token);
    //   setApproved((prevCompanies) =>
    //     prevCompanies.filter(
    //       (company) => company._id !== selectedDeleteCompanyId
    //     )
    //   );
    //   setSelectedDeleteCompanyId(null);
    //   toast.success("Company deleted successfully!");
    // } catch (error) {
    //   console.error(error.response.data.message);
    //   toast.error(error.response.data.message);
    // }
  };

  return (
    <Card extra={"w-full h-full p-4 mt-10 overflow-hidden overflow-x-auto"}>
      <div className="container mx-auto mt-8">
        <div className="flex space-x-4 overflow-hidden overflow-x-auto">
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
            Resolved
          </button>
        </div>

        {/* Render content based on the active tab */}
        {activeTab === "pending" && (
      <div className="mt-4 grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto p-4 md:grid-cols-2 lg:grid-cols-3">
      {loading ? (
        <div className="col-span-full py-4 text-center">Loading...</div>
      ) : (
        complaints.map((item) => (
          item.status === "pending" && (
            <div key={item.id} className="rounded-lg bg-blue-100 p-6 shadow-md">
              <div className="flex flex-row items-center justify-between">
                <h3 className="mb-4 text-lg font-semibold">{item.name}</h3>
                <p className="mb-4 text-sm">12-jan-2022</p>
              </div>
      
              <div className="mb-2 flex items-center justify-between text-sm text-gray-900">
                <p className="text-blue-600">
                  <BsEnvelopeFill />{" "}
                </p>{" "}
                <p>{item.email}</p>
              </div>
              <div className="mb-2 flex items-center justify-between text-sm  text-gray-900">
                <p className="text-blue-600 ">
                  <BsPhoneFill />
                </p>{" "}
                <p> {item.phone_no}</p>
              </div>
              <div className="mb-2 flex items-center text-sm text-gray-900">
                <p className="text-blue-600 ">
                  <BsQuestionCircleFill />{" "}
                </p>
                <span className="text-blue-600 ">Complaint:</span>
              </div>
              <div className="text-xs">
                <p> {item.complaint}</p>
              </div>
      
              <div className="flex justify-center">
                <button className="rounded-full bg-green-500 p-2 text-white shadow-lg hover:bg-green-600">
                  <FaRegThumbsUp />
                </button>
              </div>
            </div>
          )
        ))
      )}
    </div>
    
        )}

        {activeTab === "approved" && (
          <div className="mt-4 grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto p-4 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-4 text-center">Loading...</div>
            ) : (
              complaints.map((item) => (
                item.status === "resolved" && (
                <div
                  key={item.id}
                  className="rounded-lg bg-green-100 p-6 shadow-md"
                >
                  <div className="flex flex-row items-center justify-between">
                    <h3 className="mb-4 text-lg font-semibold">{item.name}</h3>
                    <p className="mb-4 text-sm">12-jan-2022</p>
                  </div>

                  <div className="mb-2 flex items-center justify-between text-sm text-gray-900">
                    <p className="text-green-600">
                      <BsEnvelopeFill />{" "}
                    </p>{" "}
                    <p>{item.email}</p>
                  </div>
                  <div className="mb-2 flex items-center justify-between text-sm  text-gray-900">
                    <p className="text-green-600 ">
                      <BsPhoneFill />
                    </p>{" "}
                    <p> {item.phone}</p>
                  </div>
                  <div className="mb-2 flex items-center text-sm text-gray-900">
                    <p className="text-green-600 ">
                      <BsQuestionCircleFill />{" "}
                    </p>
                    <span className="text-green-600 ">Complaint:</span>
                  </div>
                  <div className="text-xs">
                    <p> {item.complaint}</p>
                  </div>
                </div>
                )
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal for delete confirmation */}
      <Transition show={selectedDeleteCompanyId !== null} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setSelectedDeleteCompanyId(null)}
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
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      {/* Heroicon name: outline/check */}
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
                        Confirm Delete
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to Delete this company?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    onClick={confirmDelete}
                    type="button"
                    className="border-transparent inline-flex w-full justify-center rounded-md border bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedDeleteCompanyId(null)}
                    type="button"
                    className="hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      {/* Modal for Approve confirmation */}
      <Transition show={selectedCompanyId !== null} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setSelectedCompanyId(null)}
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
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      {/* Heroicon name: outline/check */}
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
                        Confirm Approve
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to Approve this company?
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
                    onClick={() => setSelectedCompanyId(null)}
                    type="button"
                    className="hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Modal for Reject confirmation */}
      <Transition show={rejectCompanyId !== null} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setRejectCompanyId(null)}
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
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      {/* Heroicon name: outline/check */}
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
                          Are you sure you want to Reject this company?
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
                    onClick={() => setRejectCompanyId(null)}
                    type="button"
                    className="hover:bg-gray-50 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Card>
  );
};

export default Complaints;
