import {
  getUnApproveCompany,
  approveCompany,
  getApprovedPendingCompany,
  deleteCompany,
} from "api/admin";
import Card from "components/card";
import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { rejectCompany } from "api/admin";
import { IoTrashSharp } from "react-icons/io5";
const UsersApprove = () => {

  const data = [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+923001234567"
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+923451234567"
    },
    {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      phone: "+923101234567"
    },
    {
      name: "Bob Brown",
      email: "bob.brown@example.com",
      phone: "+923551234567"
    },
    {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+923201234567"
    }
  ];
  
  const [activeTab, setActiveTab] = useState("pending");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [unapprovedCompanies, setUnapprovedCompanies] = useState([]);
  const [approved, setApproved] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [rejectCompanyId, setRejectCompanyId] = useState(null);

  const [selectedDeleteCompanyId, setSelectedDeleteCompanyId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUnApproveCompany();
        console.log(response.data.data);
        setUnapprovedCompanies(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching unapproved companies:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwttoken");
        const response = await getApprovedPendingCompany(token);
        console.log(response.data.data);
        setApproved(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching unapproved companies:", error);
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
    try {
      const token = localStorage.getItem("jwttoken");

      await approveCompany(selectedCompanyId);
      setUnapprovedCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company._id !== selectedCompanyId)
      );
      setSelectedCompanyId(null);
      const approvedResponse = await getApprovedPendingCompany(token);
      setApproved(approvedResponse.data.data);
      toast.success("Company approved successfully!");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };
  const confirmReject = async () => {
    try {
      const token = localStorage.getItem("jwttoken");

      const response = await rejectCompany(rejectCompanyId);
      setUnapprovedCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company._id !== rejectCompanyId)
      );
      console.log(response);
      setRejectCompanyId(null);
      const approvedResponse = await getApprovedPendingCompany(token);
      setApproved(approvedResponse.data.data);
      toast.success("Company Rejected successfully!");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("jwttoken");

      await deleteCompany(selectedDeleteCompanyId, token);
      setApproved((prevCompanies) =>
        prevCompanies.filter(
          (company) => company._id !== selectedDeleteCompanyId
        )
      );
      setSelectedDeleteCompanyId(null);
      toast.success("Company deleted successfully!");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Card extra={"w-full h-full p-4 overflow-hidden overflow-x-auto"}>
      <div className="container mx-auto mt-8">
        

        {/* Render content based on the active tab */}
       
        <table className="mt-4 max-h-[70vh] w-full overflow-x-auto overflow-y-auto">
      <thead>
        <tr className="bg-green-200">
          <th className="px-4 py-2 text-white">#</th>
          <th className="px-4 py-2 text-white">Name</th>
          <th className="px-4 py-2 text-white">Email</th>
          <th className="px-4 py-2 text-white">Ph #</th>
          <th className="px-4 py-2 text-white">Action</th>
        </tr>
      </thead>
      <tbody>
        {/* Map through dummy data */}
        {data.map((user, index) => (
          <tr key={index} className=" text-center ">
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{user.name}</td>
            <td className="px-4 py-2">{user.email}</td>
            <td className="px-4 py-2">{user.phone}</td>
            <td className="px-4 py-2 flex items-center justify-center">
              {/* <button
                onClick={() => console.log("Approve action")}
                className="mx-2 rounded bg-green-500 px-1 py-1 text-white hover:bg-green-600"
              >
                Approve
              </button> */}
              <button
                onClick={() => console.log("Reject action")}
                className="mx-2 rounded flex items-center justify-center bg-red-500 px-1 py-1 text-white hover:bg-red-600"
              >
                <IoTrashSharp />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

   
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
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
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
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
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
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
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

export default UsersApprove;
