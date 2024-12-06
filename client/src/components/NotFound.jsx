import { Link } from "react-router-dom";
import "./styles/NotFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>요청하신 페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="home-button">
        홈으로 이동
      </Link>
    </div>
  );
}

export default NotFound;
