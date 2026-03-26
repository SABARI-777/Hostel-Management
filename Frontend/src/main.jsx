import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

/**
 * GLOBAL FETCH INTERCEPTOR (Security Layer)
 * Automatically attaches JWT tokens to all backend requests.
 * Prevents unauthorized data access even if the user inspects the console.
 */
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  let [url, options] = args;
  const token = localStorage.getItem("token");
  // Only add token for requests to our backend (localhost:3000) or relative paths
  const isValidToken = token && token !== "undefined" && token !== "null" && token.length > 20;

  if (isValidToken && (url.toString().includes(":3000") || url.toString().startsWith("/"))) {
    options = options || {};
    options.headers = {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }

  const response = await originalFetch(url, options);

  // Auto-logout if token is expired or invalid
  if (response.status === 401 || response.status === 403) {
      const currentPath = window.location.pathname;
      if (currentPath !== "/" && currentPath !== "/login") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/"; // Redirect to landing/login
      }
  }

  return response;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
