import React from "react";
import Card from "components/card";
import Chart from "react-apexcharts";

const RegistrationLocation = ({ registrationLocations }) => {
  console.log(registrationLocations);

  const registrationCounts = registrationLocations
    ? registrationLocations.reduce((acc, location) => {
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {})
    : {};

  const locations = Object.keys(registrationCounts);
  const counts = Object.values(registrationCounts);

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: locations,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "16%",
        endingShape: "rounded",
        borderRadius: 6,
      },
    },
    colors: ["#004871"],
  };

  const series = [
    {
      name: "Registrations",
      data: counts,
    },
  ];

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          Registration Locations
        </h2>
      </div>

      <div className="md:mt-16 lg:mt-0">
        <div className="h-[250px] w-full xl:h-[350px]">
          <Chart
            options={options}
            series={series}
            type="bar"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    </Card>
  );
};

export default RegistrationLocation;
