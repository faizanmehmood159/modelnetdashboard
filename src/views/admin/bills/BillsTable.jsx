import Card from "components/card";
import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaRegThumbsUp, FaThumbsDown } from "react-icons/fa";
import { getAllInstallations } from "api/admin/installations";
import { approveInstallation } from "api/admin/installations";
import { toast } from "react-toastify";
import { rejectInstallation } from "api/admin/installations";
import { getAllBills } from "api/bills";
const InstallationTable = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [allInstallations, setAllInstallations] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const [loading, setLoading] = useState(true);
  const [selectedApproveId, setSelectedApproveId] = useState(null);
  const [rejectInstallationId, setRejectInstallationId] = useState(null);

  
  const fetchData = async () => {
    try {
      const response = await getAllInstallations();
      console.log(response.data.data.installations);
      setAllInstallations(response.data.data.installations);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching installations:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleApprove = async (id) => {
    setSelectedApproveId(id);
  };

  const handleReject = async (id) => {
    setRejectInstallationId(id);
  };

  const confirmApprove = async () => {
    try {
      await approveInstallation(selectedApproveId);
      fetchData();
      toast.success("Installation approved successfully!");
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error);
    } finally{
      setSelectedApproveId(null);
    }
  };
  const confirmReject = async () => {
    try {
     await rejectInstallation(rejectInstallationId);
     fetchData();
      toast.success("Installation Rejected successfully!");
    } catch (error) {
      toast.error(error);
    } finally {
      setRejectInstallationId(null);
    }
  };

  // get all Bills Api start

  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);
  const fetchBills = async () => {
    try {
      const response = await getAllBills();
      console.log(response.data.data.bills);
      setBills(response.data.data.bills);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  // get all Bills Api end
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
            Approved
          </button>
         
        </div>

        {/* Render content based on the active tab */}
        {activeTab === "pending" && (
          <table className="mt-4 max-h-[70vh] w-full overflow-x-auto overflow-y-auto">
            <thead>
              <tr className="bg-green-200">
                <th className="px-4 py-2 text-white">#</th>
                <th className="px-4 py-2 text-white">Name</th>
                <th className="px-4 py-2 text-white">Email</th>
                <th className="px-4 py-2 text-white">Package</th>                
                <th className="px-4 py-2 text-white">Price</th>
                <th className="px-4 py-2 text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                bills.map(
                  (item, index) =>
                    item.status === "pending" && (
                      <tr className=" text-center " key={item._id}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{item.user.name}</td>
                        <td className="px-4 py-2">{item.user.email}</td>                        
                        <td className="px-4 py-2">{item.packages.label}</td>                        
                        <td className="px-4 py-2">{item.packages.price} Pkr</td>
                        <td className="px-4 py-2">
                          <button className="mx-2 rounded bg-green-500 p-2  text-white  shadow-lg hover:bg-green-600" onClick={() => handleApprove(item._id)}>
                            <FaRegThumbsUp />
                          </button>
                          <button className="mx-2 rounded bg-red-500 p-2  text-white  shadow-lg hover:bg-red-600" onClick={() => handleReject(item._id)}>
                            <FaThumbsDown />
                          </button>
                        </td>
                      </tr>
                    )
                )
              )}
            </tbody>
          </table>
        )}

        {activeTab === "approved" && (
          <table className="mt-4 max-h-[70vh] w-full overflow-x-auto overflow-y-auto">
            <thead>
              <tr className="bg-green-200">
                <th className="px-4 py-2 text-white">#</th>
                <th className="px-4 py-2 text-white">Name</th>
                <th className="px-4 py-2 text-white">Email</th>
                <th className="px-4 py-2 text-white">Package</th>                
                <th className="px-4 py-2 text-white">Price</th>
                <th className="px-4 py-2 text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : (
                bills.map(
                  (item, index) =>
                    item.status === "approved" && (
                      <tr className=" text-center " key={item._id}>
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{item.user.name}</td>
                        <td className="px-4 py-2">{item.user.email}</td>                                        
                        <td className="px-4 py-2">{item.packages.label}</td>                        
                        <td className="px-4 py-2">{item.packages.price} Pkr</td>
                      </tr>
                    )
                )
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* Modal for Approve confirmation */}
      <Transition show={selectedApproveId !== null} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setSelectedApproveId(null)}
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
                          Are you sure you want to Approve this Installation?
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
                    onClick={() => setSelectedApproveId(null)}
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
      <Transition show={rejectInstallationId !== null} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setRejectInstallationId(null)}
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
                          Are you sure you want to Reject this Installation?
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
                    onClick={() => setRejectInstallationId(null)}
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

export default InstallationTable;
