import Card from "components/card";
import React from "react";
import InfoMain from "./components/Info";

const Info = () => {
  return (
    <Card extra={"w-full h-full my-6 p-4 sm:overflow-x-auto"}>
      <InfoMain />
    </Card>
  );
};

export default Info;
