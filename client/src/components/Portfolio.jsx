import React, { useState, useEffect } from "react";
import Card from "./PortfolioCard";
import Fetcher from "../Fetcher";
import "./styles/Portfolio.css";

function Portfolio() {
  const [showInput, setShowInput] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [comment, setComment] = useState("");

  const START_DATE = "2021-01-04";
  const END_DATE = "2024-05-01";

  const [currentPortfolioData, setCurrentPortfolio] = useState([]);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await Fetcher.get("http://localhost:5000/api/portfolio");

      setCurrentPortfolio(res.data);
    } catch (error) {
      console.error("포트폴리오 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // startDate로부터 1개월 뒤 날짜 계산 함수
  const getDate = (currentDate) => {
    if (!currentDate) return "";
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 1); // 한달 후
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  const handleAddPortfolio = async () => {
    const newPortfolio = {
      id: Date.now(),
      startDate,
      endDate,
      comment,
    };
    /* post to server */
    try {
      const res = await Fetcher.post(
        "http://localhost:5000/api/upadte_portfolio",
        {
          startDate,
          endDate,
          comment,
        },
        { withCredentials: true }
      );
      console.log(res.data.message);
    } catch (error) {
      console.log(`post Error`);
    }
    setCurrentPortfolio((prev) => [...prev, newPortfolio]);

    setStartDate("");
    setEndDate("");
    setComment("");
    setShowInput(false);
  };

  const handlePortfolio = () => {
    setShowInput(true);
  };
  console.log(currentPortfolioData);

  return (
    <div className="portfolio_container">
      <ul>
        {currentPortfolioData.map((data, idx) => (
          <li key={idx}>
            <Card data={data} />
          </li>
        ))}
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
              min={START_DATE}
              max={"2024-04-01"}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <input
              type="date"
              value={endDate}
              min={startDate || START_DATE}
              max={startDate ? getDate(startDate) : END_DATE}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="포트폴리오에 대한 한줄 코멘트를 입력하세요"
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
