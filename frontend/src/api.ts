import axios from "axios";

// Backend API URL
const API_URL = "http://localhost:5000";

// Create Axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set Authorization Token
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Handle API errors
export const handleApiError = (error: any): string => {
  if (error.response) {
    return error.response.data.message || "An unexpected error occurred.";
  } else if (error.request) {
    return "No response from server. Please check your network.";
  } else {
    return "Request error. Please try again.";
  }
};
