import React from "react";
import Forgot1 from "views/auth/Forgot1";
import Forgot2 from "views/auth/Forgot2";
import Forgot3 from "views/auth/Forgot3";
import Login from "views/auth/Login";
import SignUp from "views/auth/SignUp";

const authRoutes = [
  {
    name: "login",
    layout: "/auth",
    path: "login",
    component: <Login />,
  },
  {
    name: "signup",
    layout: "/auth",
    path: "signup",
    component: <SignUp />,
  },
  {
    name: "forgotEmail",
    layout: "/auth",
    path: "enterForgotEmail",
    component: <Forgot1 />,
  },
  {
    name: "ForgotOtp",
    layout: "/auth",
    path: "enterOtp",
    component: <Forgot2 />,
  },
  {
    name: "changePassword",
    layout: "/auth",
    path: "changePassword",
    component: <Forgot3 />,
  },
];
export default authRoutes;
