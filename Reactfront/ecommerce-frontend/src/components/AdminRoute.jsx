import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("TOKEN:", token);
  console.log("ROLE:", role);

  // 1. No token → admin login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. Normalize role safely
  const normalizedRole = role?.toLowerCase();

  // 3. Only allow admin
  if (normalizedRole !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;