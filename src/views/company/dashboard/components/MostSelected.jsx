import React from "react";
import Card from "components/card";
import Chart from "react-apexcharts";

const MostSelected = ({ topCompanies }) => {
  if (!topCompanies || !Array.isArray(topCompanies)) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-brand-600"></div>
      </div>
    );
  }

  const companyNames = topCompanies.map((company) => company.companyName);
  const counts = topCompanies.map((company) => company.count);

  const options = {
    chart: {
      background: "white",
      foreColor: "black",
    },
    xaxis: {
      categories: companyNames,
      labels: {
        style: {
          colors: "#A855F7",
        },
      },
    },
    yaxis: {
      title: {
        text: "user Count",
        style: {
          color: "#A855F7",
        },
      },
      labels: {
        style: {
          colors: "#A855F7",
        },
      },
    },
    colors: ["#A855F7"],
    stroke: {
      width: 6,
      curve: "smooth",
      lineCap: "round",
      lineJoin: "round",
      opacity: 1,
      colors: ["#A855F7"],
    },
  };

  const series = [
    {
      name: "User Counts",
      data: counts,
    },
  ];

  return (
    <Card extra="!p-[20px] text-center">
      <div className="flex justify-between">
        <span className="text-lg font-bold text-navy-700 dark:text-white">
          Most Selected Companies
        </span>
      </div>

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="h-full w-full">
          <Chart
            options={options}
            type="line"
            width="100%"
            height="400"
            series={series}
          />
        </div>
      </div>
    </Card>
  );
};

export default MostSelected;
