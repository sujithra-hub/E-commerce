import { jwtDecode } from "jwt-decode";
export const isLoggedIn = () => {
  return localStorage.getItem("token") !== null;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => localStorage.getItem("token");

export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.userId; // ✅ now works
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};