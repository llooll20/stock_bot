import axios from "axios";

const Fetcher = axios.create({
  baseURL: "http://localhost:5000", // 서버의 기본 URL로 변경
  withCredentials: true, // 모든 요청에 쿠키 포함
});

export default Fetcher;
