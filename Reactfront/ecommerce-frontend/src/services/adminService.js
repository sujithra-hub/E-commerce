import axios from "axios";

const BASE_URL = "http://localhost:8080/api/user";

export const registerAdmin = (data) => {
  return axios.post(`${BASE_URL}/admin/register`, data);
};