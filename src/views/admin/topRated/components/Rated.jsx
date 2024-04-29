import { getApprovedPendingCompany, deleteCompany } from "api/admin";
import Card from "components/card";
import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import { setTopRated } from "api/admin/topRated";
import { getAllCompanyDetails } from "api/admin/company";
import { setNotTopRated } from "api/admin/topRated";

const Rated = () => {
  const [companyData, setCompanyData] = useState([]);
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(true);
  const [ratedLoading, setRatedLoading] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [setDetialsId, setDetailsId] = useState(null);
  const [selectedTopRatedCompanyId, setSelectedTopRatedCompanyId] =
    useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem("jwttoken");
        const response = await getAllCompanyDetails(token);
        console.log(response.data.data);
        setDetailsId(response.data.data._id);
        setCompanyData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const confirmChangeTopRatedStatus = async () => {
    try {
      setRatedLoading(true);
      const token = localStorage.getItem("jwttoken");
      console.log(selectedTopRatedCompanyId);

      const response = await setTopRated(selectedTopRatedCompanyId, token);
      console.log(response);
      const updatedApprovedResponse = await getAllCompanyDetails(token);
      setCompanyData(updatedApprovedResponse.data.data);
      console.log(updatedApprovedResponse.data.data);
      toast.success("Set as Top Rated");
      setRatedLoading(false);
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setRatedLoading(false);
      setSelectedTopRatedCompanyId(null);
    }
  };
  const confirmChangeToNotTopRated = async () => {
    try {
      setRatedLoading(true);
      const token = localStorage.getItem("jwttoken");
      console.log(selectedTopRatedCompanyId);

      const response = await setNotTopRated(selectedTopRatedCompanyId, token);
      console.log(response);
      const updatedApprovedResponse = await getAllCompanyDetails(token);
      setCompanyData(updatedApprovedResponse.data.data);
      console.log(updatedApprovedResponse.data.data);
      toast.success("Removed from Top Rated");
      setRatedLoading(false);
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setRatedLoading(false);
      setSelectedTopRatedCompanyId(null);
    }
  };

  return (
    <Card extra={"w-full h-full my-6 p-4 overflow-hidden overflow-x-auto"}>
      <div className="container mx-auto">
        {/* Render content based on the active tab */}

        <table className="max-h-[70vh] w-full overflow-x-auto overflow-y-auto">
          <thead>
            <tr className="bg-navy-400">
              <th className="px-4 py-2 text-white">#</th>
              <th className="px-4 py-2 text-white">Image</th>
              <th className="px-4 py-2 text-white">Name</th>
              <th className="px-4 py-2 text-white">Created At</th>
              <th className="px-4 py-2 text-white">Clicks</th>
              <th className="px-4 py-2 text-white ">Top Rated</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              companyData.map((company, index) => (
                <tr key={company._id} className=" text-center">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">
                    <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                      <li className="flex h-14 w-14 items-center justify-center bg-green-200  shadow-md">
                        <img
                          className=""
                          src={
                            company?.image || "https://placehold.co/200x200/png"
                          }
                          alt="Logo"
                        />
                      </li>
                    </ul>
                  </td>
                  <td className="px-4 py-2">{company.companyName}</td>
                  <td className="px-4 py-2">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{company.click}</td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={company.topRated === true}
                      onChange={(event) => {
                        setCompany(company);
                        setSelectedTopRatedCompanyId(company._id);
                        console.log(company);
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for toprated */}

      <Transition show={selectedTopRatedCompanyId !== null} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setSelectedTopRatedCompanyId(null)}
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
                {ratedLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
                  </div>
                ) : (
                  <>
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
                          ></Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to change Status of this
                              company?
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      {company.topRated === true ? (
                        <>
                          <button
                            onClick={confirmChangeToNotTopRated}
                            type="button"
                            className={`border-transparent inline-flex w-full justify-center rounded-md border bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                          >
                            Remove From Rated
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={confirmChangeTopRatedStatus}
                            type="button"
                            className={`border-transparent inline-flex w-full justify-center rounded-md border bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                          >
                            Set Top Rated
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setSelectedTopRatedCompanyId(null)}
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
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
    </Card>
  );
};

export default Rated;
