
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Admin from "layouts/admin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Auth from "layouts/auth";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminType = localStorage.getItem("adminType");
    const jwtToken = localStorage.getItem("jwttoken");

    if (adminType === "company" && jwtToken) {
      navigate("/company");
    } else if (adminType === "admin" && jwtToken) {
      navigate("/admin");
    } else if (!adminType && !jwtToken) {
      navigate("/auth");
    }
  }, []);

  return (
    <>
      <ToastContainer autoClose={1000} />
      <Routes>
        <Route path="auth/*" element={<Auth />} />
        <Route path="admin/*" element={<Admin />} />
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </>
  );
};

export default App;
