import React from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css";

function Layout({ theme, toggleTheme }) {
  return (
    <>
      <Outlet />
      <div className="bottom-bar">
        <button onClick={toggleTheme}>
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </div>
    </>
  );
}

export default Layout;
