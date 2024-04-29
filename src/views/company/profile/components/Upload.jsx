import Card from "components/card";
import React from "react";

const Upload = ({ videoUrl }) => {
  return (
    <Card extra={"w-full h-full p-3"}>
      <iframe
        title="Company Video"
        width="100%"
        className="rounded-2xl"
        height="100%"
        src={videoUrl}
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </Card>
  );
};

export default Upload;
