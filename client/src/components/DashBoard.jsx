import ApexChart from "./ApexChart";
import Portfolio from "./Portfolio";

function DashBoard({ theme }) {
  return (
    <>
      <ApexChart theme={theme} />
      <Portfolio />
    </>
  );
}

export default DashBoard;
