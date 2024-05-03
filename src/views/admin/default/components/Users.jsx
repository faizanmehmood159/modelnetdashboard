import React from "react";
import Card from "components/card";
import Chart from "react-apexcharts";

const Users = ({ users }) => {

  const options = {
    chart: {
      background: "white",
      foreColor: "black",
    },
    xaxis: {
      categories: ["Total Users", "Total Installations"],
      labels: {
        style: {
          colors: "#004871",
        },
      },
    },
    yaxis: {
      title: {
        text: "Count",
        style: {
          color: "#004871",
        },
      },
      labels: {
        style: {
          colors: "#004871",
        },
      },
    },
    colors: ["#004871"],
    stroke: {
      width: 2,
      curve: "smooth",
      lineCap: "round",
      lineJoin: "round",
      opacity: 1,
      colors: ["#004871"],
    },
  };
  
  const series = [
    {
      name: "Count",
      data: [users?.totalUsers, users?.totalInstallation],
    },
  ];

  return (
    <Card extra="!p-[20px] text-center">
      <div className="flex justify-between">
        <span className="text-lg font-bold text-navy-600 dark:text-white">
          Users/Installations
        </span>
      </div>

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="h-full w-full">
          <Chart
            options={options}
            type="bar"
            width="100%"
            height="400"
            series={series}
          />
        </div>
      </div>
    </Card>
  );
};

export default Users;
