import React from "react";
import Card from "components/card";
import Chart from "react-apexcharts";

const Complaints = ({ complaints }) => {
  // Calculate the proportion of resolved complaints
  const totalComplaints = complaints?.totalComplaints;
  const totalResolvedComplaints = complaints?.totalResolvedComplaints;
  const unresolvedComplaints = totalComplaints - totalResolvedComplaints;

  const options = {
    chart: {
      background: "white",
      foreColor: "black",
    },
    labels: ["Resolved Complaints", "Unresolved Complaints"],
    colors: ["#4CAF50", "#F44336"],
    legend: {
      show: true,
      position: "bottom",
    },
  };

  const series = [totalResolvedComplaints, unresolvedComplaints];

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          Complaints Overview
        </h2>
      </div>

      <div className="md:mt-16 lg:mt-0">
        <div className="h-[250px] w-full xl:h-[350px]">
          <Chart
            options={options}
            type="donut" // Use "donut" chart type
            width="100%"
            height="100%"
            series={series}
          />
        </div>
      </div>
    </Card>
  );
};

export default Complaints;
