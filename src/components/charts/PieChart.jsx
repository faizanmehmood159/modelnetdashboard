import Chart from "react-apexcharts";

const PieChart = ({ series }) => {
  const options = {
    chart: {
      type: "pie",
    },
    labels: series.map((data) => data.x),
  };

  return (
    <Chart
      options={options}
      series={series.map((data) => data.y)}
      width="100%"
      height="100%"
    />
  );
};

export default PieChart;
