import ChartCard from "./ChartCard";

function PortfolioCard({ data }) {
  return (
    <>
      <ChartCard startDate={data.start} endDate={data.end} />
      <strong>{data.comment}</strong>
    </>
  );
}

export default PortfolioCard;
