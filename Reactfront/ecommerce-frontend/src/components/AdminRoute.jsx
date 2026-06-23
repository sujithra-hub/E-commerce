import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  if (role !== "ROLE_ADMIN") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;