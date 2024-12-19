import ChartCard from "./ChartCard";

function PortfolioCard({ data }) {
  return (
    <>
      <ChartCard startDate={data.startDate} endDate={data.endDate} />
      <strong>{data.comment}</strong>
    </>
  );
}

export default PortfolioCard;
