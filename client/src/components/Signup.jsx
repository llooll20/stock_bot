import { useState } from "react";
import "./styles/Signup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData((data) => {
      return {
        ...data,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/signup",
        {
          nickname: formData.nickname,
          password: formData.password,
        },
        { withCredentials: true }
      );
      setSuccess(res.data.message);
      navigate("/login"); // login으로 이동
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("회원 가입 중 오류");
      }
    }
  };
  return (
    <div className="signUp_container">
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form className="signUp_form_container" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            placeholder="사용할 아이디 입력"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="비밀번호 입력"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="비밀번호 확인"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default SignUp;
