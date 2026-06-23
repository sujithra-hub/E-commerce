import axios from "axios";
import { getUserIdFromToken, getToken } from "../utils/auth";

const BASE_URL = "http://localhost:8080/api/wishlist";

/* HEADER */
const authHeader = () => {
  const token = getToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* =========================
   GET WISHLIST
========================= */
export const getWishlistAPI = async () => {
  const userId = getUserIdFromToken();

  if (!userId) throw new Error("User ID not found in token");

  const res = await axios.get(
    `${BASE_URL}/${userId}`,
    authHeader()
  );

  return res.data;
};

/* =========================
   ADD TO WISHLIST (FIXED)
========================= */
export const addToWishlistAPI = async (productId) => {
  const userId = getUserIdFromToken();

  if (!userId) throw new Error("User ID not found in token");

  const res = await axios.post(
    `${BASE_URL}/${userId}/${productId}`,   // ✅ FIXED
    null,
    authHeader()
  );

  return res.data;
};

/* =========================
   REMOVE FROM WISHLIST (FIXED)
========================= */
export const removeWishlistAPI = async (productId) => {
  const userId = getUserIdFromToken();

  if (!userId) throw new Error("User ID not found in token");

  const res = await axios.delete(
    `${BASE_URL}/${userId}/${productId}`,   // ✅ FIXED
    authHeader()
  );

  return res.data;
};