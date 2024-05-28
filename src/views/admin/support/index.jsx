import Card from "components/card";
import React from "react";
const Support = () => {
  return (
    <Card extra={"w-full h-full p-4 mt-6 overflow-hidden overflow-x-auto h-[580px]"}>
      <iframe
      className="w-full h-full"
        id="iFrameExample"
        title="iFrame Example"
        src="https://dashboard.tawk.to/#/chat"
      ></iframe>
    </Card>
  );
};

export default Support;
