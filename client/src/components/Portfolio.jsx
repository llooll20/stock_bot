import React, { useState } from "react";
import Card from "./PortfolioCard";
import "./styles/Portfolio.css";

function Portfolio() {
  const [showInput, setShowInput] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [comment, setComment] = useState("");
  const [currentPortfolioData, setPortfolioData] = useState([]);

  const dummy = [
    {
      id: 1734602747478,
      startDate: "2024-12-05",
      endDate: "2024-12-06",
      comment: "1",
    },
    {
      id: 1734602760901,
      startDate: "2024-12-20",
      endDate: "2024-12-27",
      comment: "213",
    },
  ];

  const handleAddPortfolio = () => {
    console.log("Click");
    const newPortfolio = {
      id: Date.now(),
      startDate,
      endDate,
      comment,
    };
    setPortfolioData((prev) => [...prev, newPortfolio]);
    console.log(currentPortfolioData);

    setStartDate("");
    setEndDate("");
    setComment("");
    setShowInput(false);
  };

  const handlePortfolio = () => {
    setShowInput(true);
  };

  return (
    <div className="portfolio_container">
      <ul>
        {dummy.map((data) => {
          <li key={data.id}>
            <Card data={data} />
          </li>;
        })}
      </ul>
      {!showInput && (
        <button className="outline" onClick={handlePortfolio}>
          포트폴리오 추가하기
        </button>
      )}
      {showInput && (
        <div style={{ marginTop: "10px" }}>
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder=""
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button className="outline" onClick={handleAddPortfolio}>
            추가하기
          </button>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
