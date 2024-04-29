import React, { useState, useEffect } from "react";
import Card from "components/card";
import { FaEdit, FaEllipsisH, FaTrash } from "react-icons/fa";
import { Transition } from "@headlessui/react";
import { IoCloseCircle } from "react-icons/io5";
import { titleSubtitle } from "api/admin/occupation";
import { toast } from "react-toastify";
import { MdFileUpload } from "react-icons/md";

const OccupationTable = () => {
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isAddOccupationOpen, setIsAddOccupationOpen] = useState(false);
  const [isEditOccupationOpen, setIsEditOccupationOpen] = useState(false);
  const [isDeleteOccupationOpen, setIsDeleteOccupationOpen] = useState(false);
  const [category, setCategory] = useState({ name: "", subCategories: [""] });
  const [titleSubtitleData, setTitleSubtitleData] = useState([]);
  const [selectedTitleId, setSelectedTitleId] = useState(null);
  const [selectedEditItemId, setSelectedEditItemId] = useState(null);
  const [categoryImage, setCategoryImage] = useState("");

  const [subcategoryImagesFiles, setSubcategoryImagesFiles] = useState([]);
  const [subcategoryImagesPreviews, setSubcategoryImagesPreviews] = useState(
    []
  );

  const closeAddOccupationModal = () => {
    setIsAddOccupationOpen(false);
    setCategory({ name: "", subCategories: [""] });
    setCategoryImage("");
    setSubcategoryImagesFiles([]);
    setSubcategoryImagesPreviews([]);
  };

  const [showDropdown, setShowDropdown] = useState(
    Array(titleSubtitleData.length).fill(false)
  );
  const handleEllipsisClick = (index) => {
    const updatedDropdownState = [...showDropdown];
    updatedDropdownState[index] = !updatedDropdownState[index];
    setShowDropdown(updatedDropdownState);
  };

  const [titleData, setTitleData] = useState("");
  const [titleImage, setTitleImage] = useState("");
  const [subTitlesData, setSubTitlesData] = useState([]);
  const [subTitlesImages, setSubTitlesImages] = useState([]);

  const handleUpdateSubCategoryTitleChange = (index, value) => {
    const updatedSubTitlesData = [...subTitlesData];
    updatedSubTitlesData[index] = value;
    setSubTitlesData(updatedSubTitlesData);
  };

  const handleUpdateSubcategoryImageChange = (e, index) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result;
        const updatedSubTitlesImages = [...subTitlesImages];
        updatedSubTitlesImages[index] = base64Image;
        setSubTitlesImages(updatedSubTitlesImages);

        // Optionally, you can set the preview images
        const updatedPreviews = [...subcategoryImagesPreviews];
        updatedPreviews[index] = base64Image;
        setSubcategoryImagesPreviews(updatedPreviews);
      };

      reader.readAsDataURL(file);
    }
  };
  const handleEditClick = (item) => {
    const titleData = item.title.text;
    const titleImage = item.title.image;
    const subTitlesData = item.subTitles.map((subtitle) => subtitle.text);
    const subTitleImages = item.subTitles.map((subtitle) => subtitle.image);
    setTitleData(titleData);
    setTitleImage(titleImage);
    setSubTitlesData(subTitlesData);
    setSubTitlesImages(subTitleImages);
    console.log("title Data", titleData);
    console.log("title Data", titleImage);
    console.log("title Data", subTitlesData);
    console.log("title Data", subTitleImages);

    setCategory({
      name: item.title,
      subCategories: item.subTitles,
    });
    setSelectedEditItemId(item._id);
    setIsEditOccupationOpen(true);
  };

  const handleEditCategoryTitleChange = (newTitle) => {
    setTitleData(newTitle);
  };

  const handleEditCategoryImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result;
        setTitleImage(base64Image);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAddNewSubCategory = () => {
    setSubTitlesData([...subTitlesData, ""]);
    setSubTitlesImages([...subTitlesImages, null]);
  };
  const handleRemoveSubCategory = (index) => {
    const updatedSubTitlesData = [...subTitlesData];
    const updatedSubTitlesImages = [...subTitlesImages];

    updatedSubTitlesData.splice(index, 1);
    updatedSubTitlesImages.splice(index, 1);

    setSubTitlesData(updatedSubTitlesData);
    setSubTitlesImages(updatedSubTitlesImages);
  };

  const openDeleteModal = (titleId) => {
    setSelectedTitleId(titleId);
    setIsDeleteOccupationOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteOccupationOpen(false);
  };

  const onDelete = async () => {
    try {
      setDeleteLoading(true);
      const deleteOccupationData = {
        type: "delete",
        titleId: selectedTitleId,
      };
      const response = await titleSubtitle(deleteOccupationData);

      if (response && response.status === 200) {
        const refetchResponse = await titleSubtitle({ type: "get" });
        setTitleSubtitleData(refetchResponse.data.data);
        toast.success(response.data.message);
      } else {
        console.error(
          "Failed to delete occupation. Server returned:",
          response
        );
      }
      setDeleteLoading(false);
    } catch (error) {
      console.error("Error deleting occupation:", error);
      setDeleteLoading(false);
    }
    closeDeleteModal();
  };

  const handleCategoryChange = (value) => {
    setCategory({ ...category, name: value });
  };

  const handleAddSubCategory = () => {
    setCategory({
      ...category,
      subCategories: [...category.subCategories, ""],
    });
    setSubcategoryImagesFiles([...subcategoryImagesFiles, null]);
    setSubcategoryImagesPreviews([...subcategoryImagesPreviews, null]);
  };

  const handleSubCategoryChange = (index, value) => {
    const updatedSubCategories = [...category.subCategories];
    updatedSubCategories[index] = value;
    setCategory({ ...category, subCategories: updatedSubCategories });
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setCategoryImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubcategoryImageChange = (e, index) => {
    const file = e.target.files[0];

    if (file) {
      const updatedFiles = [...subcategoryImagesFiles];
      updatedFiles[index] = file;
      setSubcategoryImagesFiles(updatedFiles);

      const reader = new FileReader();

      reader.onloadend = () => {
        const updatedPreviews = [...subcategoryImagesPreviews];
        updatedPreviews[index] = reader.result;
        setSubcategoryImagesPreviews(updatedPreviews);
      };

      reader.readAsDataURL(file);
    } else {
      const updatedFiles = [...subcategoryImagesFiles];
      updatedFiles[index] = null;
      setSubcategoryImagesFiles(updatedFiles);

      const updatedPreviews = [...subcategoryImagesPreviews];
      updatedPreviews[index] = null;
      setSubcategoryImagesPreviews(updatedPreviews);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getTitleSubtitle = {
          type: "get",
        };
        const response = await titleSubtitle(getTitleSubtitle);
        setTitleSubtitleData(response.data.data);
        console.log(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Title subtitle:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addOccupation = async () => {
    try {
      setAddLoading(true);
      const subtitleImagesBase64 = await Promise.all(
        subcategoryImagesFiles.map(async (subtitleImageFile) => {
          if (subtitleImageFile) {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result);
              };
              reader.readAsDataURL(subtitleImageFile);
            });
          } else {
            return "";
          }
        })
      );

      const addOccupationData = {
        type: "add",
        title: category.name,
        titleImage: categoryImage,
        subTitles: category.subCategories.filter(
          (subCategory) => subCategory.trim() !== ""
        ),
        subtitleImages: subtitleImagesBase64,
      };

      const formData = new FormData();

      for (const key in addOccupationData) {
        if (key === "subTitles") {
          addOccupationData[key].forEach((subTitle, index) => {
            formData.append(`${key}[${index}]`, subTitle);
          });
        } else if (key === "titleImage") {
          formData.append(key, categoryImage);
        } else if (key === "subtitleImages") {
          addOccupationData[key].forEach((subtitleImage, index) => {
            formData.append(`${key}[${index}]`, subtitleImage);
          });
        } else {
          formData.append(key, addOccupationData[key]);
        }
      }
      console.log(addOccupationData);
      const response = await titleSubtitle(addOccupationData);
      if (response && response.status === 200) {
        const refetchResponse = await titleSubtitle({ type: "get" });
        setTitleSubtitleData(refetchResponse.data.data);
        toast.success(response.data.message);
        setCategory({ name: "", subCategories: [""] });
      } else {
        console.error("Failed to add occupation. Server returned:", response);
      }

      setIsAddOccupationOpen(false);
      setAddLoading(false);
      setCategoryImage("");
      setSubcategoryImagesFiles([]);
      setSubcategoryImagesPreviews([]);
    } catch (error) {
      console.error("Error adding occupation:", error);
      setAddLoading(false);
    } finally {
      setAddLoading(false);
    }
  };

  const closeEditModal = () => {
    setCategory({ name: "", subCategories: [""] });
    setSelectedEditItemId(null);
    setIsEditOccupationOpen(false);
  };

  const handleEditSubmit = async () => {
    const editOccupationData = {
      type: "update",
      titleId: selectedEditItemId,
      title: titleData,
      titleImage: titleImage,
      subTitles: subTitlesData,
      subtitleImages: subTitlesImages,
    };
    console.log(editOccupationData);

    try {
      setEditLoading(true);
      const response = await titleSubtitle(editOccupationData);
      if (response && response.status === 200) {
        const refetchResponse = await titleSubtitle({ type: "get" });
        setTitleSubtitleData(refetchResponse.data.data);
        toast.success(response.data.message);
        closeEditModal();
      } else {
        console.error("Failed to edit occupation. Server returned:", response);
      }
      setEditLoading(false);
    } catch (error) {
      console.error("Error editing occupation:", error);
      setEditLoading(false);
    } finally {
      setEditLoading(false);
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
            <div className="relative flex items-center justify-between">
              <div className="text-xl font-bold text-navy-700 dark:text-white"></div>
              <button
                onClick={() => setIsAddOccupationOpen(true)}
                className="mr-4 mt-4 rounded-md bg-brand-50 px-4 py-2 text-white"
              >
                Add Occupation
              </button>
            </div>

            <div className="mt-8 h-full overflow-x-scroll xl:overflow-hidden">
              <div className="max-h-[80vh] overflow-y-auto">
                <table className="w-full text-center">
                  <thead>
                    <tr>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                        #
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                        Category
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                        Sub Category
                      </th>
                      <th className="whitespace-nowrap border-b border-gray-200 px-1 pb-[10px] text-gray-700 dark:!border-navy-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {titleSubtitleData.map((item, index) => (
                      <tr key={item._id}>
                        <td className="pb-4 pt-4 sm:text-base">
                          <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                            <li className="m-2 w-full rounded p-2 shadow-md">
                              {index + 1}
                            </li>
                          </ul>
                        </td>
                        <td className="pb-4 pt-4 sm:text-base">
                          <ul className="flex list-inside list-none flex-row items-center justify-center px-4">
                            <li className="m-2 flex w-full flex-row items-center justify-around rounded p-2 shadow-md">
                              <img
                                className="h-10 w-14"
                                src={item.title.image}
                              />{" "}
                              {item.title.text}
                            </li>
                          </ul>
                        </td>
                        <td className="p-2 sm:text-base">
                          <ul className=" grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-5">
                            {item.subTitles.map((subtitle, index) => (
                              <li
                                key={index}
                                className="m-2 flex w-full flex-row items-center justify-around rounded p-2 shadow-md"
                              >
                                <img
                                  className="h-10 w-14"
                                  src={subtitle.image}
                                />{" "}
                                {subtitle.text}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="pb-[18px] pt-[14px] sm:text-[14px]">
                          <div className="relative inline-block text-left">
                            <button
                              className="rounded bg-brand-50 px-4 py-2 text-white "
                              onClick={() => handleEllipsisClick(index)}
                            >
                              <FaEllipsisH />
                            </button>

                            {showDropdown[index] && (
                              <div className="my-1">
                                <div className="ring-black animate-fade-in  bg-grey-500 absolute right-0 mt-0 flex origin-top-right rounded-md shadow-lg ring-opacity-5">
                                  <button
                                    className="block px-4 py-2 text-blue-700 hover:bg-gray-200"
                                    onClick={() => handleEditClick(item)}
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(item._id)}
                                    className="block px-4 py-2 text-red-700 hover:bg-gray-200"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Add Occupation */}
      <Transition show={isAddOccupationOpen} as={React.Fragment}>
        <div className="fixed inset-0 z-50 overflow-y-auto">
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
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
            </Transition.Child>

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
              <div className="z-50 inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                {/* Your modal content goes here */}
                <div className="bg-white px-2 py-3">
                  {addLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-50"></div>
                    </div>
                  ) : (
                    <>
                      <div className="">
                        {/* Modal Header */}
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0">
                          <div className="flex flex-row items-center justify-between">
                            <h3
                              className="text-lg font-medium leading-6 text-gray-900"
                              id="modal-title"
                            >
                              Add Occupation
                            </h3>
                            <button
                              onClick={closeAddOccupationModal}
                              type="button"
                              className=" text-3xl text-red-500"
                            >
                              <IoCloseCircle />
                            </button>
                          </div>

                          <div className="mt-3 px-3">
                            <div className="">
                              <div className="mb-3">
                                <label className="my-1 block text-left text-sm font-medium text-gray-600">
                                  Category
                                </label>
                                <input
                                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-50 focus:outline-none"
                                  placeholder="Category..."
                                  type="text"
                                  value={category.name}
                                  onChange={(e) =>
                                    handleCategoryChange(e.target.value)
                                  }
                                />
                              </div>
                              <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
                                <div className="relative mb-2 rounded-lg border border-dashed border-gray-300 p-4 text-center">
                                  <label
                                    htmlFor="categoryImage"
                                    className="block text-sm font-medium text-gray-600"
                                  >
                                    <MdFileUpload className="mx-auto mb-2 text-[80px] text-brand-50 dark:text-white" />
                                    Category Image
                                    <input
                                      className="hidden"
                                      id="categoryImage"
                                      type="file"
                                      onChange={handleCategoryImageChange}
                                    />
                                  </label>
                                </div>
                                <div className="mb-2 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
                                  <img
                                    className="h-[14vh] w-auto"
                                    src={categoryImage}
                                    alt="image"
                                  />
                                </div>
                              </div>
                              <div className="mb-3">
                                <label className="my-1 block text-left text-sm font-medium text-gray-600">
                                  Sub Category
                                </label>
                                {category.subCategories.map(
                                  (subCategory, index) => (
                                    <div key={index} className="mb-2">
                                      <input
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-50 focus:outline-none"
                                        placeholder={`Sub category ${
                                          index + 1
                                        }...`}
                                        type="text"
                                        value={subCategory}
                                        onChange={(e) =>
                                          handleSubCategoryChange(
                                            index,
                                            e.target.value
                                          )
                                        }
                                      />

                                      {/* Subcategory Image Upload */}

                                      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
                                        <div className="relative mb-2 rounded-lg border border-dashed border-gray-300 p-4 text-center">
                                          <label
                                            htmlFor={`subCategoryImage_${index}`}
                                            className="block text-sm font-medium text-gray-600"
                                          >
                                            <MdFileUpload className="mx-auto mb-2 text-[80px] text-brand-50 dark:text-white" />
                                            Subcategory Image {index + 1}
                                            <input
                                              className="hidden"
                                              id={`subCategoryImage_${index}`}
                                              type="file"
                                              onChange={(e) =>
                                                handleSubcategoryImageChange(
                                                  e,
                                                  index
                                                )
                                              }
                                            />
                                          </label>
                                        </div>
                                        <div className="mb-2 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
                                          {subcategoryImagesPreviews[index] && (
                                            <img
                                              className="h-[14vh] w-auto"
                                              src={
                                                subcategoryImagesPreviews[index]
                                              }
                                              alt={`Subcategory Image ${
                                                index + 1
                                              }`}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="flex items-end justify-end">
                                <button
                                  onClick={handleAddSubCategory}
                                  className="rounded-md bg-blue-500 p-2 px-6 font-bold text-white hover:bg-blue-600"
                                >
                                  Add Subcategory
                                </button>
                              </div>

                              <div className="mt-3 flex items-center justify-center">
                                <button
                                  onClick={addOccupation}
                                  className="my-3 rounded-md bg-brand-50 p-2 px-6 font-bold text-white hover:bg-brand-50"
                                >
                                  Add Occupation
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>

      {/* Edit Occupation */}
      <Transition show={isEditOccupationOpen} as={React.Fragment}>
        <div className="fixed inset-0 z-50 overflow-y-auto">
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
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
            </Transition.Child>

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
              <div className="z-50 inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                {/* Your modal content goes here */}
                <div className="bg-white px-2 py-2">
                  {editLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
                    </div>
                  ) : (
                    <>
                      <div className="">
                        {/* Modal Header */}
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0">
                          <div className="flex flex-row items-center justify-between">
                            <h3
                              className="text-lg font-medium leading-6 text-gray-900"
                              id="modal-title"
                            >
                              Edit Occupation
                            </h3>
                            <button
                              onClick={closeEditModal}
                              type="button"
                              className=" text-3xl text-red-500"
                            >
                              <IoCloseCircle />
                            </button>
                          </div>

                          <div className="mt-3 px-3">
                            <div className="">
                              <div className="mb-3">
                                <label className="my-1 block text-left text-sm font-medium text-gray-600">
                                  Category
                                </label>
                                <input
                                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none"
                                  placeholder="Category..."
                                  type="text"
                                  value={titleData}
                                  onChange={(e) =>
                                    handleEditCategoryTitleChange(
                                      e.target.value
                                    )
                                  }
                                />

                                <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
                                  <div className="relative mb-2 rounded-lg border border-dashed border-gray-300 p-4 text-center">
                                    <label
                                      htmlFor="categoryImage"
                                      className="block text-sm font-medium text-gray-600"
                                    >
                                      <MdFileUpload className="mx-auto mb-2 text-[80px] text-brand-500 dark:text-white" />
                                      Category Image
                                      <input
                                        className="hidden"
                                        id="categoryImage"
                                        type="file"
                                        onChange={handleEditCategoryImageChange}
                                      />
                                    </label>
                                  </div>
                                  <div className="relative mb-2 rounded-lg border border-dashed border-gray-300 p-4 text-center">
                                    <img
                                      className="h-[14vh] w-auto"
                                      src={titleImage}
                                      alt="image"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="mb-3">
                                {subTitlesData.map((subCategory, index) => (
                                  <div
                                    key={index}
                                    className="my-2 rounded-lg border border-gray-300 p-2"
                                  >
                                    <div className="mb-2 flex w-full flex-row items-center justify-between">
                                      <label className="my-1 block text-left text-sm font-medium text-gray-600">
                                        Sub Category
                                      </label>

                                      <button
                                        onClick={() =>
                                          handleRemoveSubCategory(index)
                                        }
                                        type="button"
                                        className=" text-3xl text-red-500"
                                      >
                                        <IoCloseCircle />
                                      </button>
                                    </div>

                                    <input
                                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none"
                                      placeholder={`Sub category ${
                                        index + 1
                                      }...`}
                                      type="text"
                                      value={subCategory}
                                      onChange={(e) =>
                                        handleUpdateSubCategoryTitleChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                    />

                                    <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 3xl:grid-cols-2">
                                      <div className="relative mb-2 rounded-lg border border-dashed border-gray-300 p-4 text-center">
                                        <label
                                          htmlFor={`subCategoryImage_${index}`}
                                          className="block text-sm font-medium text-gray-600"
                                        >
                                          <MdFileUpload className="mx-auto mb-2 text-[80px] text-brand-500 dark:text-white" />
                                          Subcategory Image {index + 1}
                                          <input
                                            className="hidden"
                                            id={`subCategoryImage_${index}`}
                                            type="file"
                                            onChange={(e) =>
                                              handleUpdateSubcategoryImageChange(
                                                e,
                                                index
                                              )
                                            }
                                          />
                                        </label>
                                      </div>
                                      <div className="mb-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300">
                                        {subTitlesImages[index] && (
                                          <img
                                            className="h-[14vh] w-auto"
                                            src={subTitlesImages[index]}
                                            alt=""
                                          />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                <div className=" flex items-end justify-end">
                                  <button
                                    onClick={handleAddNewSubCategory}
                                    className="rounded-md bg-blue-500 p-2 px-6 font-bold text-white hover:bg-blue-600"
                                  >
                                    Add Subcategory
                                  </button>
                                </div>

                                <div className="mt-3 flex items-center justify-center">
                                  <button
                                    onClick={handleEditSubmit}
                                    className="rounded-md bg-brand-500 p-2 px-6 font-bold text-white hover:bg-brand-600"
                                  >
                                    Update
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>

      {/* DELETE Occupation Modal */}
      <Transition show={isDeleteOccupationOpen} as={React.Fragment}>
        <div className="fixed inset-0 z-50 overflow-y-auto">
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
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
            </Transition.Child>

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
              <div className="z-50 inline-block transform overflow-hidden rounded-lg bg-white text-center align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                {deleteLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
                  </div>
                ) : (
                  <>
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="">
                        <div className="mt-3 text-center sm:mt-0 sm:text-center">
                          <h1
                            className="text-center text-3xl font-medium leading-6 text-gray-900"
                            id="modal-title"
                          >
                            ⚠️
                          </h1>
                          <p className="mt-3 text-sm text-gray-500">
                            Are you sure you want to delete this item?
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="justify-center px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        onClick={onDelete}
                        type="button"
                        className="border-transparent mx-2 inline-flex w-full justify-center rounded-md border bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={closeDeleteModal}
                        type="button"
                        className="border-transparent mx-2 mt-2 inline-flex w-full justify-center rounded-md border bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
};

export default OccupationTable;
