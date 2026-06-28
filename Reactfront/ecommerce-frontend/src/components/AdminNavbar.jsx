import { Link, useNavigate, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin/AdminLogin");
  };

  const isActive = (path) => location.pathname === path;

  // Normalize role safely
  const normalizedRole = role ? role.toLowerCase() : "";

  // Hide only on auth pages
  const isAuthPage =
    location.pathname === "/admin/AdminLogin" ||
    location.pathname === "/admin/register";

  // ❌ FIX: DO NOT block based on /admin path or /user path
  // Only control visibility via auth + role

  if (!token || normalizedRole !== "admin" || isAuthPage) {
    return null;
  }

  return (
    <nav style={styles.navbar}>
      {/* LOGO */}
      <div style={styles.logo}>
        🛍️ <span style={styles.logoText}>ShopAdmin</span>
      </div>

      {/* NAV LINKS */}
      <div style={styles.links}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.link,
              ...(isActive(item.path) ? styles.activeLink : {}),
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.rightSection}>
        <button
          onClick={() => navigate("/admin/AdminProfile")}
          style={styles.profileBtn}
          title="Profile"
        >
          👤
        </button>

        <button onClick={handleLogout} style={styles.logout}>
          🔓 Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;

/* NAV ITEMS */
const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "🏠" },
  { label: "Category", path: "/admin/categories", icon: "📂" },
  { label: "Products", path: "/admin/products", icon: "📦" },
  { label: "Orders", path: "/admin/orders", icon: "🛒" },
];

/* STYLES */
const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 30px",
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  logoText: {
    background: "linear-gradient(90deg,#22c55e,#3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  links: {
    display: "flex",
    gap: "25px",
  },

  link: {
    color: "#e5e7eb",
    textDecoration: "none",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 8px",
    transition: "0.3s",
  },

  icon: {
    fontSize: "16px",
  },

  activeLink: {
    color: "#22c55e",
    borderBottom: "2px solid #22c55e",
  },

  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  profileBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "8px 10px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "16px",
  },

  logout: {
    background: "linear-gradient(135deg,#ef4444,#f97316)",
    border: "none",
    color: "#fff",
    padding: "8px 18px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    boxShadow: "0 0 10px rgba(239,68,68,0.5)",
  },
};