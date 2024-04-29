import { addInfoHub } from "api/admin/info";
import { titleSubtitle } from "api/admin/occupation";
import Card from "components/card";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";

const AddInfoHub = () => {
  const navigate = useNavigate()
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [uploadType, setUploadType] = useState("file");
  const [url, setUrl] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [description, setDescription] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleTitleChange = (selectedOption) => {
    setSelectedTitle(selectedOption);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleVideoUpload = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUploadTypeChange = (e) => {
    setUploadType(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedTitle) {
      toast.error("Select title Please.");
      return;
    }
    if (uploadType === "url") {
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

      if (!urlRegex.test(url)) {
        toast.error("Please enter a valid URL.");
        return;
      }
      if (!description || description.length < 300) {
        toast.error(
          "Description is required and must be at least 300 characters long."
        );
        return;
      }
      const body = {
        desc: description,
        titlesId: selectedTitle.value,
        video: url,
        type: uploadType,
      };
      let data = new FormData();
      data.append("des", body.desc);
      data.append("titlesId", body.titlesId);
      data.append("url", body.video);
      console.log(body);
      try {
        setAddLoading(true);
        const response = await addInfoHub(data);
        console.log(response.data.message);
        if (response.data.message === "InfoHub created successfully")
          toast.success(response.data.message);
          navigate("/admin/default")
      } catch (error) {
        console.log(error.response.data.message);
        if (error.response.data.message === "Title already exists") {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.response.data.message);
        }
      } finally {
        setAddLoading(false);
      }
      console.log(body);
    } else if (uploadType === "file") {
      if (!selectedTitle) {
        toast.error("Select title Please.");
        return;
      }
      if (!videoFile) {
        toast.error("Please upload video.");
        return;
      }

      if (!description || description.length < 300) {
        toast.error(
          "Description is required and must be at least 300 characters long."
        );
        return;
      }
      const body = {
        desc: description,
        titlesId: selectedTitle.value,
        video: videoFile,
        type: uploadType,
      };
      let data = new FormData();
      data.append("des", body.desc);
      data.append("titlesId", body.titlesId);
      data.append("video", body.video);
      try {
        setAddLoading(true);
        const response = await addInfoHub(data);
        console.log(response.data.message);
        if (response.data.message === "InfoHub created successfully")
          toast.success(response.data.message);
          navigate("/admin/default")
      } catch (error) {
        console.log(error.response.data.message);
        if (error.response.data.message === "Title already exists") {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.response.data.message);
        }
      } finally {
        setAddLoading(false);
      }

      console.log(body);
    }
  };

  useEffect(() => {
    fetchTitle();
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

  return (
    <Card extra={"w-full mt-6 h-full my-3 p-4 sm:overflow-x-auto"}>
      {addLoading ? (
        <div className="my-20 flex h-full items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-500"></div>
        </div>
      ) : (
        <>
          <form>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-600"
              >
                Select Category
              </label>
              <Select
                id="title"
                options={titles}
                value={selectedTitle}
                onChange={handleTitleChange}
                placeholder="Select a title"
              />
            </div>

            <div className="mb-4 flex overflow-hidden rounded-md bg-gray-200">
              <label
                htmlFor="file"
                className={`flex-1 cursor-pointer py-2 text-center ${
                  uploadType === "file"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  id="file"
                  value="file"
                  checked={uploadType === "file"}
                  onChange={handleUploadTypeChange}
                  className="hidden"
                />
                Upload File
              </label>

              <label
                htmlFor="url"
                className={`flex-1 cursor-pointer py-2 text-center ${
                  uploadType === "url"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                <input
                  type="radio"
                  id="url"
                  value="url"
                  checked={uploadType === "url"}
                  onChange={handleUploadTypeChange}
                  className="hidden"
                />
                Add URL
              </label>
            </div>

            {uploadType === "url" && (
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
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="Enter URL"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
            )}

            {uploadType === "file" && (
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

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-600"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Enter description"
                className="mt-1 w-full rounded-md border border-gray-300 p-2"
              />
            </div>

            <div className="flex flex-row justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Add Info
              </button>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};

export default AddInfoHub;
