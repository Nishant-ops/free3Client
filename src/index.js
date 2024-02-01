import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.scss";
import { BrowserRouter } from "react-router-dom";

const ROOT = document.getElementById("app");

const root = ReactDOM.createRoot(ROOT);
root.render(
  <BrowserRouter basename="/">
    <App />
  </BrowserRouter>
);
