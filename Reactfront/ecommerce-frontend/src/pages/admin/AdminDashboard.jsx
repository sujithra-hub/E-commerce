import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  const adminId = localStorage.getItem("adminId");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/products/${adminId}`,
        authHeader
      );

      setProducts(res.data);

      // ✅ METHOD 1: Count from products
      const uniqueCategories = new Set(
        res.data.map((p) => p.category)
      );
      setCategoryCount(uniqueCategories.size);

    } catch (err) {
      console.log("Products error:", err);
    }
  };

  // ---------------- FETCH ORDERS ----------------
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/orders/${adminId}`,
        authHeader
      );
      setOrders(res.data);
    } catch (err) {
      console.log("Orders error:", err);
    }
  };

  // ---------------- FETCH REVENUE ----------------
  const fetchRevenue = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/revenue/${adminId}`,
        authHeader
      );
      setRevenue(res.data.revenue || 0);
    } catch (err) {
      console.log("Revenue error:", err);
    }
  };

  // ---------------- OPTIONAL: FETCH CATEGORY COUNT FROM BACKEND ----------------
  const fetchCategoryCount = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/admin/categories/${adminId}`,
        authHeader
      );
      setCategoryCount(res.data.length);
    } catch (err) {
      console.log("Category error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchRevenue();

    // 🔥 Uncomment if you have category API
    // fetchCategoryCount();

  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      {/* ✅ CATEGORY MANAGEMENT BUTTON */}
      <div style={styles.topBar}>
        <button
          onClick={() => navigate("/admin/categories")}
          style={styles.categoryBtn}
        >
          Manage Categories
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Total Products</h3>
          <p>{products.length}</p>
        </div>

        <div style={styles.card}>
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div style={styles.card}>
          <h3>Revenue</h3>
          <p>₹ {revenue}</p>
        </div>

        <div style={styles.card}>
          <h3>Total Categories</h3>
          <p>{categoryCount}</p>
        </div>
      </div>

      {/* ================= PRODUCTS TABLE ================= */}
      <h2 style={styles.sectionTitle}>Your Products</h2>

      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={styles.row}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>₹ {p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= ORDERS TABLE ================= */}
      <h2 style={styles.sectionTitle}>Recent Orders</h2>

      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id} style={styles.row}>
              <td>{o.id}</td>
              <td>{o.productName || o.productId}</td>
              <td>{o.quantity}</td>
              <td>₹ {o.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;

const styles = {
  container: {
    padding: "30px",
    background: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  topBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  },

  categoryBtn: {
    padding: "10px 20px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },

  sectionTitle: {
    marginTop: "40px",
    marginBottom: "10px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "10px",
    overflow: "hidden",
  },

  thead: {
    background: "#333",
    color: "white",
  },

  row: {
    borderBottom: "1px solid #ddd",
  },
};