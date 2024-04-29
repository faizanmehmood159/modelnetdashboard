import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { addInfo } from "api/admin/info";
import { getInfo } from "api/admin/info";
import { toast } from "react-toastify";
const InfoMain = () => {
  const [addLoading, setAddLoading] = useState(false);
  const [content, setContent] = useState({
    title: "Your Heading...",
    des: ["Your paragraph"],
  });

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      setAddLoading(true);
      const response = await getInfo();
      setContent(response.data.data);
    } catch (error) {
    } finally {
      setAddLoading(false);
    }
  };

  const addParagraph = () => {
    setContent({
      ...content,
      des: [...content.des, ""],
    });
  };

  const removeParagraph = (index) => {
    const newDes = [...content.des];
    newDes.splice(index, 1);
    setContent({
      ...content,
      des: newDes,
    });
  };

  const handleTextChange = (index, newText) => {
    const newDes = [...content.des];
    newDes[index] = newText;
    setContent({
      ...content,
      des: newDes,
    });
  };

  const handleHeadingChange = (newText) => {
    setContent({
      ...content,
      title: newText,
    });
  };

  const handleSubmit = async () => {
    const body = {
      infoId: "123",
      title: content.title,
      des: content.des,
    };
    try {
      setAddLoading(true);
      const response = await addInfo(body);
      console.log(response);
      toast.success("Information updated successfully");
      fetchInfo();
    } catch (error) {
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <>
      {addLoading ? (
        <div className="my-20 flex h-full items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-500"></div>
        </div>
      ) : (
        <>
          <div className="container mx-auto my-4 rounded-md bg-gray-200 p-4">
            <div className="mb-4">
              <input
                type="text"
                value={content.title}
                onChange={(e) => handleHeadingChange(e.target.value)}
                className="border-md mb-2 rounded-md border border-gray-400 p-2"
              />
            </div>
            {content.des.map((paragraph, index) => (
              <div key={index} className="mb-4 border">
                <div className="flex w-full flex-row items-center justify-between">
                  <label className="block text-sm font-semibold">
                    Paragraph {index + 1}
                  </label>
                  <button
                    className=" my-2 rounded-md bg-red-500 px-2 py-1 text-white "
                    onClick={() => removeParagraph(index)}
                  >
                    <MdClose />
                  </button>
                </div>

                <textarea
                  value={paragraph}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  className="mb-2 w-full rounded-md border border-gray-400 p-2"
                  rows="4"
                />
              </div>
            ))}
            <div className="flex w-full flex-row justify-between">
              <button
                className="rounded-lg bg-green-500 px-4 py-2 text-white shadow-md"
                onClick={addParagraph}
              >
                Add Paragraph
              </button>
              <button
                className=" rounded-lg bg-brand-500 px-4 py-2 text-white shadow-md"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InfoMain;
