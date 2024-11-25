import ApexChart from "react-apexcharts";
import { useEffect, useState } from "react";

const Chart = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const getChartData = async () => {
    const json = await (await fetch("http://localhost:5000/")).json();
    const result = json.splice(1);
    setChartData(result);
    setLoading(false);
  };
  useEffect(() => {
    getChartData();
  }, []);

  return isLoading ? (
    <h1>isLoading...</h1>
  ) : (
    <ApexChart
      type="candlestick"
      height="500"
      series={[
        {
          data: chartData.map((item) => {
            return [
              item.date,
              Number(item.high_price.split(",").join("")),
              Number(item.low_price.split(",").join("")),
              Number(item.opening_price.split(",").join("")),
              Number(item.closing_price.split(",").join("")),
            ];
          }),
        },
      ]}
      options={{
        theme: { mode: "dark" },
        chart: {
          toolbar: { show: true },
          background: "transparent",
        },
        stroke: { curve: "smooth", width: 1 },
        grid: { show: true },
        yaxis: { show: true },
        xaxis: {
          labels: {
            show: true,
            datetimeFormatter: {
              day: "yyyy.MM.dd",
            },
          },
          axisTicks: { show: true },
          axisBorder: { show: true },
          type: "datetime",
        },
      }}
    ></ApexChart>
  );
};

export default Chart;
