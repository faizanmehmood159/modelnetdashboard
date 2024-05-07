import React from "react";
import Login from "views/auth/Login";

const authRoutes = [
  {
    name: "login",
    layout: "/auth",
    path: "login",
    component: <Login />,
  }, 
];
export default authRoutes;
