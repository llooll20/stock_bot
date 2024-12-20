import ApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import Fetcher from "../Fetcher";

function ChartCard({ startDate, endDate }) {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    fetchChartData();
  }, [startDate, endDate]);
  const fetchChartData = async () => {
    try {
      const res = await Fetcher.get("http://localhost:5000/api/range_chart", {
        params: {
          startDate,
          endDate,
        },
      });

      setChartData(res.data);
    } catch (error) {
      console.error(`차트 정보 가져오는 중 에러가 발생`);
    }
  };
  return (
    <ApexChart
      type="candlestick"
      height="400"
      width="400"
      series={[
        {
          data: chartData.map((item) => {
            return [
              item.date,
              Number(item.opening_price.split(",").join("")),
              Number(item.high_price.split(",").join("")),
              Number(item.low_price.split(",").join("")),
              Number(item.closing_price.split(",").join("")),
            ];
          }),
        },
      ]}
      options={{
        theme: {
          mode: "dark",
        },
        chart: {
          toolbar: { show: false },
          background: "transparent",
        },
        stroke: { curve: "smooth", width: 1 },
        grid: {
          show: true,
          borderColor: "black",
        },
        yaxis: { show: true },
        xaxis: {
          labels: {
            show: true,
            datetimeFormatter: {
              day: "yyyy.MM.dd",
            },
            axisBorder: {
              color: "black",
            },
          },
          axisTicks: { show: true },
          axisBorder: {
            show: true,
            color: "black",
          },
          type: "datetime",
        },
      }}
    ></ApexChart>
  );
}

export default ChartCard;
