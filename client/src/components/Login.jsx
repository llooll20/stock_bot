import "./styles/Login.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData((formData) => {
      return {
        ...formData,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/login",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);

      if (res.data.message === "로그인 성공!") {
        navigate("/chart");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("로그인 중 오류가 발생");
      }
    }
  };
  return (
    <div className="login_container">
      {error && <p className="error">{error}</p>}
      <form className="loginForm_container" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="nickname"
            placeholder="아이디"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">로그인</button>
        <div>
          <Link to="/signup" className="register_button">
            계정이 없으신가요?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
