import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

// ✅ Get all products
export const getProducts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// ✅ Get products by category
export const getProductsByCategory = async (categoryId) => {
  const res = await axios.get(`${API_URL}/category/${categoryId}`);
  return res.data;
};