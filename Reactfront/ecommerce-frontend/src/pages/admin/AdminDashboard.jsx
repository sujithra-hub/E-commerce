import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.userId || decoded.sub || decoded.id;
        setUserId(id);
      } catch (err) {
        console.log("JWT error:", err);
      }
    }
  }, [token]);

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/products",
        getAuthHeaders()
      );

      const allProducts = res.data || [];

      const myProducts = allProducts.filter((p) => {
        const ownerId =
          p.userId ||
          p.createdBy ||
          p.sellerId ||
          p.user?.id ||
          p.adminId;

        return String(ownerId) === String(userId);
      });

      setProducts(myProducts);

      const uniqueCategories = new Set(
        myProducts.map((p) => p.category)
      );

      setCategoryCount(uniqueCategories.size);
    } catch (err) {
      console.log("Products error:", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/orders",
        getAuthHeaders()
      );

      const allOrders = res.data || [];

      const myProductIds = products.map((p) => p.id);

      const myOrders = allOrders.filter((order) => {
        if (!Array.isArray(order.items)) return false;

        return order.items.some((item) =>
          myProductIds.includes(item.productId)
        );
      });

      setOrders(myOrders);

      const totalRevenue = myOrders.reduce((sum, order) => {
        if (!Array.isArray(order.items)) return sum;

        const orderTotal = order.items.reduce((sub, item) => {
          if (myProductIds.includes(item.productId)) {
            return sub + (item.price || 0) * (item.quantity || 1);
          }
          return sub;
        }, 0);

        return sum + orderTotal;
      }, 0);

      setRevenue(totalRevenue);
    } catch (err) {
      console.log("Orders error:", err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchProducts();
  }, [userId]);

  useEffect(() => {
    if (products.length === 0) return;
    fetchOrders();
  }, [products]);

  const safeValue = (val) => {
    if (val === null || val === undefined) return "-";

    if (typeof val === "object") {
      return (
        val.name ||
        val.title ||
        val.status ||
        val.type ||
        JSON.stringify(val)
      );
    }

    return val;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>✨ E-Commerce Control Panel</h1>

      {/* STATS */}
      <div style={styles.grid}>
        <StatCard title="Products" value={products.length} icon="📦" color="#7c3aed" />
        <StatCard title="Orders" value={orders.length} icon="🛒" color="#06b6d4" />
        <StatCard title="Categories" value={categoryCount} icon="📂" color="#f59e0b" />
        <StatCard title="Revenue" value={`₹ ${revenue}`} icon="💰" color="#22c55e" />
      </div>

      <Section title="Products">
        <Table
          headers={["ID", "Name", "Category", "Price"]}
          data={products.map((p) => [
            safeValue(p.id),
            safeValue(p.name),
            safeValue(p.category),
            `₹ ${safeValue(p.price)}`,
          ])}
        />
      </Section>

      <Section title="Orders">
        <Table
          headers={["Order ID", "Name", "City", "Status", "Total"]}
          data={orders.map((o) => [
            safeValue(o.id),
            safeValue(o.name),
            safeValue(o.city),
            safeValue(o.status),
            `₹ ${safeValue(o.totalAmount)}`,
          ])}
        />
      </Section>
    </div>
  );
};

export default AdminDashboard;

/* COMPONENTS */

const StatCard = ({ title, value, icon, color }) => (
  <div
    style={{
      ...styles.card,
      borderLeft: `5px solid ${color}`,
    }}
  >
    <div style={{ fontSize: "30px" }}>{icon}</div>
    <h3>{title}</h3>
    <p style={styles.stat}>{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div style={styles.section}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    {children}
  </div>
);

const Table = ({ headers, data }) => (
  <div style={styles.tableWrapper}>
    <table style={styles.table}>
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={headers.length} style={styles.center}>
              No Data Found
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr key={i} style={styles.row}>
              {row.map((cell, j) => (
                <td key={j} style={styles.td}>{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

/* STYLES */

const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
    background:
      "radial-gradient(circle at top left, #1e1b4b, #0f172a, #020617)",
    color: "#fff",
  },

  title: {
    textAlign: "center",
    fontSize: "34px",
    marginBottom: "30px",
    fontWeight: "700",
    letterSpacing: "1px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "20px",
    textAlign: "center",
    transition: "0.3s",
    cursor: "pointer",
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
  },

  stat: {
    fontSize: "26px",
    fontWeight: "700",
    marginTop: "10px",
  },

  section: {
    marginTop: "50px",
  },

  sectionTitle: {
    fontSize: "20px",
    marginBottom: "15px",
  },

  tableWrapper: {
    overflowX: "auto",
    borderRadius: "14px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(255,255,255,0.95)",
    color: "#111",
    borderRadius: "10px",
  },

  th: {
    padding: "14px",
    background: "#0f172a",
    color: "#fff",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  },

  row: {
    transition: "0.2s",
  },

  center: {
    textAlign: "center",
    padding: "20px",
  },
};