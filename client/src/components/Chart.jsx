import fakeDB from "../fakeDB.json";
import ApexCharts from "react-apexcharts";
function Chart() {
  return (
    <ApexCharts
      type="candlestick"
      height="500"
      series={[
        {
          data: fakeDB.map((item) => {
            return [item.date, item.open, item.close, item.high, item.low];
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
    ></ApexCharts>
  );
}

export default Chart;
