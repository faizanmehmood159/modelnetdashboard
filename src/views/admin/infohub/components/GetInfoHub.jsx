import React, { useState, useEffect } from "react";
import Card from "components/card";
import { getInfoHub } from "api/admin/info";
import { FaEdit } from "react-icons/fa";
import Select from "react-select";
import { Dialog, Transition } from "@headlessui/react";
import { titleSubtitle } from "api/admin/occupation";
import { updateInfoHub } from "api/admin/info";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const GetInfoHub = () => {
  const [infoHubData, setInfoHubData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [uploadUpdateType, setUploadUpdateType] = useState("updateUrl");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchTitle();
    fetchInfoHubData();
  }, []);

  const fetchTitle = async () => {
    try {
      const getTitleSubtitle = {
        type: "get",
      };
      const response = await titleSubtitle(getTitleSubtitle);
      const formattedTitles = response.data.data.map((item) => ({
        label: item.title.text,
        value: item._id,
        image: item.title.image,
      }));
      setTitles(formattedTitles);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInfoHubData = async () => {
    try {
      const response = await getInfoHub();
      setInfoHubData(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (itemId) => {
    const selectedItem = infoHubData.find((item) => item._id === itemId);
    setEditedData({ ...selectedItem });
    setSelectedItemId(itemId);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItemId(null);
    setEditedData({});
  };

  const handleVideoUpload = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleEditSubmit = async () => {
    if (uploadUpdateType === "updateUrl") {
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

      if (!urlRegex.test(editedData.video)) {
        toast.error("Please enter a valid URL.");
        return;
      }
      const body = {
        desc: editedData.des,
        titlesId: editedData.titlesId,
        video: editedData.video,
      };
      console.log(body);

      let data = new FormData();
      data.append("des", body.desc);
      data.append("titlesId", body.titlesId);
      data.append("url", body.video);
      console.log(body);
      try {
        setEditLoading(true);
        const response = await updateInfoHub(data);
        console.log(response.data.message);
        if (response.data.message === "InfoHub created successfully")
          toast.success("InfoHub Updated Successfully");
        fetchInfoHubData();
        closeEditModal();
        navigate("/admin/default");
      } catch (error) {
        console.log(error);
        if (error.response.data.message === "Title already exists") {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.response.data.message);
        }
      } finally {
        setEditLoading(false);
      }
    } else if (uploadUpdateType === "updateFile") {
      const body = {
        desc: editedData.des,
        titlesId: editedData.titlesId,
        thisIsVideo: videoFile,
      };
      let data = new FormData();
      data.append("des", body.desc);
      data.append("titlesId", body.titlesId);
      data.append("video", body.thisIsVideo);
      console.log(body);
      try {
        setEditLoading(true);
        const response = await updateInfoHub(data);
        console.log(response);
        if (response.data.message === "InfoHub created successfully")
          toast.success(response.data.message);
        fetchInfoHubData();
        closeEditModal();
        navigate("/admin/default");
      } catch (error) {
        console.log(error);
        if (error.response.data.message === "Title already exists") {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.response.data.message);
        }
      } finally {
        setEditLoading(false);
      }

      console.log(body);
    }
  };
  const handleTitleChange = (selectedOption) => {
    setSelectedTitle(selectedOption);
    setEditedData({ ...editedData, titlesId: selectedOption.value });
  };

  useEffect(() => {
    if (isEditModalOpen && editedData.titlesId) {
      const selectedTitle = titles.find(
        (title) => title.value === editedData.titlesId
      );
      setSelectedTitle(selectedTitle);
    }
  }, [isEditModalOpen, editedData.titlesId]);

  const handleTabChange = (tabType) => {
    setUploadUpdateType(tabType);
  };

  return (
    <div className="mb-6 mt-2 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-4">
      {infoHubData.map((item) => (
        <Card
          key={item._id}
          extra={"w-full h-full my-2 shadow-md p-4 sm:overflow-x-auto relative"}
        >
          <div className="top-2 flex flex-row items-center justify-end">
            <button
              className="rounded-full bg-blue-100 p-2 text-blue-500 focus:outline-none"
              onClick={() => openEditModal(item._id)}
            >
              <FaEdit />
            </button>
          </div>

          <div className="mb-4">
            <label
              htmlFor={`video_${item._id}`}
              className="block text-sm font-medium text-gray-600"
            >
              Video
            </label>
            <video
              id={`video_${item._id}`}
              controls
              className="mt-1 h-60 w-full rounded-md border border-gray-300 p-2"
            >
              <source src={item.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="mb-4">
            <label
              htmlFor={`description_${item._id}`}
              className="block text-lg font-medium text-gray-800"
            >
              Description
            </label>
            <div className="mt-1 w-full rounded-md">{item.des}</div>
          </div>
        </Card>
      ))}

      <Transition show={isEditModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={closeEditModal}
        >
          <div className="flex min-h-screen items-center justify-center p-6">
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

            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative z-50 w-full max-w-3xl rounded-md bg-white p-2 shadow-md">
                {editLoading ? (
                  <div className="my-20 flex h-full items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-500"></div>
                  </div>
                ) : (
                  <>
                    <h2 className="mb-4 text-xl font-semibold">Update</h2>
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-600"
                      >
                        Select Category
                      </label>
                      <Select
                        isDisabled
                        id="title"
                        options={titles}
                        value={selectedTitle}
                        onChange={handleTitleChange}
                        placeholder="Select a title"
                      />
                    </div>
                    <div className="mb-4 flex overflow-hidden rounded-md bg-gray-200">
                      <button
                        className={`flex-1 cursor-pointer py-2 text-center ${
                          uploadUpdateType === "updateFile"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                        onClick={() => handleTabChange("updateFile")}
                      >
                        Upload File
                      </button>

                      <button
                        className={`flex-1 cursor-pointer py-2 text-center ${
                          uploadUpdateType === "updateUrl"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                        onClick={() => handleTabChange("updateUrl")}
                      >
                        Add URL
                      </button>
                    </div>

                    {uploadUpdateType === "updateUrl" && (
                      <div className="mb-4">
                        <label
                          htmlFor="url"
                          className="block text-sm font-medium text-gray-600"
                        >
                          URL
                        </label>
                        <input
                          type="text"
                          id="url"
                          value={editedData.video}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              video: e.target.value,
                            })
                          }
                          placeholder="Enter URL"
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                    )}
                    {uploadUpdateType === "updateFile" && (
                      <div className="mb-4">
                        <label
                          htmlFor="video"
                          className="block text-sm font-medium text-gray-600"
                        >
                          Upload Video
                        </label>
                        <input
                          type="file"
                          id="video"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="mt-1 w-full rounded-md border border-gray-300 p-2"
                        />
                      </div>
                    )}

                    <label className="mb-2 block">
                      Edited Description:
                      <textarea
                        value={editedData.des}
                        onChange={(e) =>
                          setEditedData({ ...editedData, des: e.target.value })
                        }
                        className="mt-1 w-full rounded-md border border-gray-300 p-2"
                      />
                    </label>

                    <div className="flex justify-end">
                      <button
                        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                        onClick={handleEditSubmit}
                      >
                        Update
                      </button>
                      <button
                        className="ml-2 rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                        onClick={closeEditModal}
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
    </div>
  );
};

export default GetInfoHub;
