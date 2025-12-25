import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 🔐 Attach token EVERY request
API.interceptors.request.use(
  (req) => {
    // Keep your existing code
    const token = localStorage.getItem("token");

    // ✅ ADDED: Also check for admin token to fix 401 errors for Admin actions
    const adminToken = localStorage.getItem("adminToken");

    // Use user token if available, otherwise fallback to admin token
    const activeToken = token || adminToken;

    if (activeToken) {
      req.headers.Authorization = `Bearer ${activeToken}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;
