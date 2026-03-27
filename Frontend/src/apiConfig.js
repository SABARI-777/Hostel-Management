export const API = import.meta.env.VITE_API_URL || "https://hostel-management-cykl.onrender.com";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token && token !== "undefined" && token !== "null" && token.length > 20
    ? { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
};