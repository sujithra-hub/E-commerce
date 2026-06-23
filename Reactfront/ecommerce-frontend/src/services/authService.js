import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const loginUser = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};