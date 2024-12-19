import Chart from "./components/Chart";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import { useState, useEffect } from "react";
import Layout from "./Layout";

import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* 백엔드 기능 완성시 element 수정 예정 */}
          <Route element={<Layout theme={theme} toggleTheme={toggleTheme} />}>
            <Route path="/" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/chart" element={<Chart theme={theme} />}></Route>
            {/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
            <Route path="*" element={<NotFound />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
