import Card from "components/card";
import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const SocialMedia = ({ socialMediaData }) => {
  return (
    <Card
      extra={
        "w-full h-full flex flex-col items-center justify-center  text-white  p-4"
      }
    >
      <a
        href={socialMediaData?.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="m-2 flex w-full items-center rounded bg-blue-600 p-2 shadow-md"
      >
        <FaFacebook className="mr-2" />
        <p className="">Facebook</p>
      </a>
      <a
        href={socialMediaData?.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="m-2 flex w-full items-center rounded bg-[#000] p-2 shadow-md"
      >
        <FaTwitter className="mr-2" />
        <p className="">Twitter</p>
      </a>
      <a
        href={socialMediaData?.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="m-2 flex w-full items-center rounded bg-blue-400 p-2 shadow-md"
      >
        <FaLinkedin className="mr-2" />
        <p className="">LinkedIn</p>
      </a>
      <a
        href={socialMediaData?.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="m-2 flex w-full items-center rounded bg-gradient-to-r from-pink-600 to-purple-500 p-2 shadow-md"
      >
        <FaInstagram className="mr-2" />
        <p className="text-white hover:underline">Instagram</p>
      </a>
    </Card>
  );
};

export default SocialMedia;
