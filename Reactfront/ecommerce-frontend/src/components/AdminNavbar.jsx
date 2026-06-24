import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin/AdminLogin");
  };

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 20px",
      background: "#1e1e2f",
      color: "#fff"
    }}>

      {/* LEFT SIDE */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/admin/dashboard" style={{ color: "#fff" }}>Home</Link>
        <Link to="/admin/categories" style={{ color: "#fff" }}>Category</Link>
        <Link to="/admin/products" style={{ color: "#fff" }}>Product</Link>
        <Link to="/admin/orders" style={{ color: "#fff" }}>Orders</Link>
        <Link to="/admin/analytics" style={{ color: "#fff" }}>Analytics</Link>
      </div>

      {/* RIGHT SIDE */}
      <button onClick={handleLogout} style={{ cursor: "pointer" }}>
        Logout
      </button>

    </nav>
  );
};

export default AdminNavbar;