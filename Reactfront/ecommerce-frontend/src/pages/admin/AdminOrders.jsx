import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [view, setView] = useState("dashboard");
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/orders",
        getAuthHeaders()
      );
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FILTER (ONLY MY PRODUCTS ORDERS) =================
  const myOrders = orders.filter((order) =>
    order.items?.some(
      (item) => String(item.adminId) === String(userId)
    )
  );

  // ================= STATUS UPDATE =================
  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/orders/${orderId}/status`,
        { status },
        getAuthHeaders()
      );
      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ================= STATS =================
  const totalOrders = myOrders.length;

  const confirmed = myOrders.filter((o) => o.status === "CONFIRMED").length;
  const shipped = myOrders.filter((o) => o.status === "SHIPPED").length;
  const outForDelivery = myOrders.filter(
    (o) => o.status === "OUT_FOR_DELIVERY"
  ).length;
  const delivered = myOrders.filter((o) => o.status === "DELIVERED").length;

  return (
    <div style={styles.wrapper}>
      {/* ================= SIDEBAR ================= */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>📦 Admin Orders</h2>

        <div
          style={view === "dashboard" ? styles.activeItem : styles.item}
          onClick={() => setView("dashboard")}
        >
          📊 Dashboard
        </div>

        <div
          style={view === "orders" ? styles.activeItem : styles.item}
          onClick={() => setView("orders")}
        >
          📋 Orders
        </div>

        <button style={styles.backBtn} onClick={() => setView("dashboard")}>
          ⬅ Back
        </button>
      </div>

      {/* ================= MAIN ================= */}
      <div style={styles.main}>
        <h1 style={styles.title}>Orders Management</h1>

        {/* ================= DASHBOARD ================= */}
        {view === "dashboard" && (
          <div style={styles.cardGrid}>
            <div style={styles.cardBlue}>
              <h2>{totalOrders}</h2>
              <p>Total Orders</p>
            </div>

            <div style={styles.cardYellow}>
              <h2>{confirmed}</h2>
              <p>Confirmed</p>
            </div>

            <div style={styles.cardPurple}>
              <h2>{shipped}</h2>
              <p>Shipped</p>
            </div>

            <div style={styles.cardOrange}>
              <h2>{outForDelivery}</h2>
              <p>Out for Delivery</p>
            </div>

            <div style={styles.cardGreen}>
              <h2>{delivered}</h2>
              <p>Delivered</p>
            </div>
          </div>
        )}

        {/* ================= ORDERS LIST ================= */}
        {view === "orders" && (
          <div>
            <h2>🧾 My Orders</h2>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {myOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.userName}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span style={styles.status}>
                        {order.status}
                      </span>
                    </td>

                    <td>
                      {/* CONFIRM */}
                      <button
                        style={styles.confirmBtn}
                        onClick={() =>
                          updateStatus(order.id, "CONFIRMED")
                        }
                      >
                        Confirm
                      </button>

                      {/* SHIPPED */}
                      <button
                        style={styles.shipBtn}
                        onClick={() =>
                          updateStatus(order.id, "SHIPPED")
                        }
                      >
                        Ship
                      </button>

                      {/* OUT FOR DELIVERY */}
                      <button
                        style={styles.outBtn}
                        onClick={() =>
                          updateStatus(order.id, "OUT_FOR_DELIVERY")
                        }
                      >
                        Out
                      </button>

                      {/* DELIVERED */}
                      <button
                        style={styles.deliverBtn}
                        onClick={() =>
                          updateStatus(order.id, "DELIVERED")
                        }
                      >
                        Deliver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

/* ================= STYLES ================= */
const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "220px",
    background: "#111827",
    padding: "20px",
  },

  logo: {
    marginBottom: "20px",
  },

  item: {
    padding: "12px",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "8px",
    background: "#1f2937",
  },

  activeItem: {
    padding: "12px",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "8px",
    background: "#3b82f6",
  },

  backBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#1f2937",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
  },

  main: {
    flex: 1,
    padding: "30px",
  },

  title: {
    marginBottom: "20px",
  },

  cardGrid: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },

  cardBlue: {
    background: "#2563eb",
    padding: "20px",
    borderRadius: "10px",
    flex: "1",
  },

  cardYellow: {
    background: "#eab308",
    padding: "20px",
    borderRadius: "10px",
    flex: "1",
  },

  cardPurple: {
    background: "#a855f7",
    padding: "20px",
    borderRadius: "10px",
    flex: "1",
  },

  cardOrange: {
    background: "#f97316",
    padding: "20px",
    borderRadius: "10px",
    flex: "1",
  },

  cardGreen: {
    background: "#16a34a",
    padding: "20px",
    borderRadius: "10px",
    flex: "1",
  },

  table: {
    width: "100%",
    marginTop: "15px",
    borderCollapse: "collapse",
    background: "#1e293b",
  },

  status: {
    padding: "5px 10px",
    borderRadius: "6px",
    background: "#334155",
  },

  confirmBtn: {
    background: "#22c55e",
    marginRight: "5px",
    border: "none",
    padding: "6px",
    cursor: "pointer",
  },

  shipBtn: {
    background: "#3b82f6",
    marginRight: "5px",
    border: "none",
    padding: "6px",
    cursor: "pointer",
  },

  outBtn: {
    background: "#f97316",
    marginRight: "5px",
    border: "none",
    padding: "6px",
    cursor: "pointer",
  },

  deliverBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px",
    cursor: "pointer",
  },
};