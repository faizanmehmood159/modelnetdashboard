import React from "react";
import PieChart from "components/charts/PieChart";
import Card from "components/card";

const PieChartCard = ({ locations }) => {
  const locationCounts = locations.reduce((acc, location) => {
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(locationCounts).map(
    ([location, count]) => ({
      x: location,
      y: count,
    })
  );

  const totalLocations = locations.length;
  const mostLocations = Object.entries(locationCounts).reduce(
    (max, [location, count]) => {
      return count > max.count ? { location, count } : max;
    },
    { location: "", count: 0 }
  );

  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex w-full flex-row items-center justify-center px-3 pt-2">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Registration Locations
        </h4>
      </div>

      <div className="mb-auto flex h-[220px] w-full items-center justify-center">
        <PieChart series={pieChartData} />
      </div>

      <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-brand-500" />
            <p className="ml-1 text-xs font-normal text-gray-600">
              Total locations
            </p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
            {totalLocations}
          </p>
        </div>

        <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
            <p className="ml-1 text-xs font-normal text-gray-600">
              Most Locations
            </p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
            {mostLocations.location} ({mostLocations.count})
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PieChartCard;
