import ChartCard from "./ChartCard";
import "./styles/Portfolio.css";

function PortfolioCard({ id, onDelete, data }) {
  const handleClick = (e) => {
    onDelete(e.target.id);
  };
  return (
    <li className="card_container">
      <ChartCard startDate={data.start} endDate={data.end} />
      <div>{data.comment}</div>
      <button id={id} onClick={handleClick} className="deleteBtn">
        포트폴리오 삭제하기
      </button>
    </li>
  );
}

export default PortfolioCard;
