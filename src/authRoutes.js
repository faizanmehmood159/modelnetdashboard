import React from "react";
import Login from "views/auth/Login";
import ChatwootWidget from "views/auth/chat";

const authRoutes = [
  {
    name: "login",
    layout: "/auth",
    path: "login",
    component: <Login />,
  }, 
  {
    name: "chat",
    layout: "/auth",
    path: "chat",
    component: <ChatwootWidget />,
  },
];
export default authRoutes;
