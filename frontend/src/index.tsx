import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { AppRoutes } from "@/Router";

const container = document.querySelector("#root");
createRoot(container!).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>,
);
