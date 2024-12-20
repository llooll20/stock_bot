import React, { useState, useEffect } from "react";
import axios from "axios";

const PortfolioList = () => {
  const [currentPortfolio, setCurrentPortfolio] = useState([]);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const deletePortfolio = async () => {
    fetch('http://localhost:5000/del', { // 요청을 보낼 서버의 URL
      method: 'DELETE',                // HTTP DELETE 메서드를 사용
      headers: {                       // 요청 헤더에 인증 정보 추가
        Authorization: localStorage.getItem('access_token'), // 토큰을 헤더에 추가
      },
      body: JSON.stringify({           // 요청 본문에 삭제할 데이터의 ID 포함
        cart_id: data.cart_id,         // 삭제할 데이터의 cart_id
      }),
    })
  }
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
