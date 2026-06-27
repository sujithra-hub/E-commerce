import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { logout } from "../utils/auth";
import logo from "../assets/shopmart-logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // ✅ ADDED ROLE CHECK

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      if (search.trim() !== "") {
        navigate(`/Home?search=${search}`);
      }
    }
  };

  // ❌ Hide navbar conditions
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = [
    "/",
    "/user/Userlogin",
    "/user/register",
    "/admin/Adminlogin",
    "/admin/register",
    "/register",
  ].includes(location.pathname);

  // ✅ FINAL RULE:
  // show navbar ONLY if:
  // - token exists
  // - role is user
  // - not admin route
  // - not auth page

  if (!token || role !== "user" || isAdminRoute || isAuthRoute) {
    return null;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.topRow}>
        <div style={styles.leftSection} onClick={() => navigate("/Home")}>
          <img src={logo} alt="ShopMart Logo" style={styles.logoImg} />
        </div>

        <div style={styles.centerSection}>SHOPMART</div>

        <div style={styles.rightSection}>
          <button style={styles.profileCircle} onClick={() =>navigate("/Profile")}>
            👤
          </button>

          <button style={styles.iconBtn} onClick={() => navigate("/wishlist")}>
            ❤️
          </button>

          <button style={styles.iconBtn} onClick={() => navigate("/cart")}>
            🛒
          </button>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={styles.searchRow}>
        <input
          type="text"
          placeholder="Search for products, brands..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          style={styles.search}
        />
      </div>

      <div style={styles.bottomBar}>
        <button style={styles.navBtn} onClick={() => navigate("/Home")}>
          Home
        </button>
        <button style={styles.navBtn} onClick={() => navigate("/categories")}>
          Categories
        </button>
        <button style={styles.navBtn} onClick={() => navigate("/wishlist")}>
          Wishlist
        </button>
        <button style={styles.navBtn} onClick={() => navigate("/cart")}>
          Cart
        </button>
      </div>
    </div>
  );
};

export default Navbar;

/* ================= STYLES ================= */

const styles = {
  wrapper: {
    background: "#0f172a",
    color: "white",
  },

  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
  },

  leftSection: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  centerSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "32px",
    fontWeight: "bold",
    letterSpacing: "2px",
    color: "#ff9900",
  },

  rightSection: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "10px",
  },

  logoImg: {
    height: "70px",
    width: "70px",
    objectFit: "contain",
    cursor: "pointer",
  },

  profileCircle: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#2c2f36",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  iconBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "none",
    background: "#2c2f36",
    color: "white",
    cursor: "pointer",
  },

  logoutBtn: {
    padding: "8px 14px",
    background: "#ff4d4f",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  searchRow: {
    display: "flex",
    justifyContent: "center",
    padding: "10px 20px",
  },

  search: {
    width: "60%",
    padding: "12px 15px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
  },

  bottomBar: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    padding: "12px",
    background: "#111827",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },

  navBtn: {
    background: "transparent",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
  },
};