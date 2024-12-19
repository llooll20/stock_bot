function PortfolioCard({ data }) {
  return (
    <>
      <strong>{data.comment}</strong>
      <div>시작일: {data.startDate}</div>
      <div>종료일: {data.endDate}</div>
    </>
  );
}

export default PortfolioCard;
