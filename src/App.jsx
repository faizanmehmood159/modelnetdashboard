
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Admin from "layouts/admin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Auth from "layouts/auth";
import ChatwootWidget from "../src/views/auth/chat"

const App = () => {

  const navigate = useNavigate();
console.log("navigate",navigate)
  useEffect(() => {
    const login = localStorage.getItem("login");
    if (login === "true") {
      navigate("/admin");
    } else if (!login) {
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
