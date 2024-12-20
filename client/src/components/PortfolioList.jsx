import React, { useState, useEffect } from "react";
import axios from "axios";

const PortfolioList = () => {
  const [currentPortfolio, setCurrentPortfolio] = useState([]);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/portfolio");
      setCurrentPortfolio(response.data);
    } catch (error) {
      console.error("포트폴리오 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const addPortfolio = async (newPortfolio) => {
    try {
    } catch (error) {
      console.error("포트폴리오를 추가하는 중 오류 발생:", error);
    }
  };
};

export default PortfolioList;
