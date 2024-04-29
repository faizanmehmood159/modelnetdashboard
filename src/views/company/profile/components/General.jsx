import Card from "components/card";
import React from "react";

const General = ({ detailsData }) => {
  return (
    <Card extra={"w-full h-full p-3"}>
      {/* Header */}
      <div className="mb-8 mt-2 w-full">
        <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
          General Information
        </h4>
        <p className="mt-2 px-2 text-base text-gray-800">
          {detailsData?.description}
        </p>
      </div>
    </Card>
  );
};

export default General;
