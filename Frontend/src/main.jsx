import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
  let [url, options] = args;

  const token = localStorage.getItem("token");
  const isValidToken =
    token && token !== "undefined" && token !== "null" && token.length > 20;

  // Identify if this is a request to our backend
  const urlStr = url.toString();
  const isBackendRequest = 
    urlStr.includes("hostel-management-cykl.onrender.com") || 
    urlStr.includes(":3000") || 
    urlStr.startsWith("/");

  if (isValidToken && isBackendRequest) {
    options = options || {};
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  const response = await originalFetch(url, options);

  // Auto logout on unauthorized
  if (response.status === 401 || response.status === 403) {
    const currentPath = window.location.pathname;
    if (currentPath !== "/" && currentPath !== "/login") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  }

  return response;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);