import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AdminOrders = () => {
  const [view, setView] = useState("dashboard");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [popup, setPopup] = useState("");

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const userId = decoded?.userId;

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

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/products",
        getAuthHeaders()
      );
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // ================= MY PRODUCT IDS =================
  const myProductIds = useMemo(() => {
    if (!products?.length || !userId) return [];

    return products
      .filter((p) => {
        const ownerId =
          typeof p.createdBy === "object"
            ? p.createdBy?.id
            : p.createdBy;

        return String(ownerId) === String(userId);
      })
      .map((p) => String(p.id));
  }, [products, userId]);

  // ================= MY ORDERS =================
  const myOrders = useMemo(() => {
    if (!orders?.length) return [];

    return orders.filter((order) => {
      if (!order) return false;

      if (order.productIds?.length) {
        return order.productIds.some((pid) =>
          myProductIds.includes(String(pid))
        );
      }

      if (order.items?.length) {
        return order.items.some((item) =>
          myProductIds.includes(
            String(item.productId || item.product?.id || item.id)
          )
        );
      }

      if (order.orderItems?.length) {
        return order.orderItems.some((item) =>
          myProductIds.includes(
            String(item.productId || item.product?.id)
          )
        );
      }

      return false;
    });
  }, [orders, myProductIds]);

  // ================= STATUS UPDATE =================
 const updateStatus = async (orderId, status) => {
  try {
    await axios.put(
      `http://localhost:8080/api/orders/status/${orderId}?status=${status}`,
      {},
      getAuthHeaders()
    );

    fetchOrders(); // refresh after update
  } catch (err) {
    console.error(err);
  }
};
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
      {popup && <div style={styles.popup}>{popup}</div>}

      <div style={styles.sidebar}>
        <h2>📦 Admin Orders</h2>

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
      </div>

      <div style={styles.main}>
        <h1>Orders Management</h1>

        <h3 style={{ color: "yellow" }}>
          My Product IDs Count: {myProductIds.length}
        </h3>

        {view === "dashboard" && (
          <div style={styles.cardGrid}>
            <div style={styles.cardBlue}><h2>{totalOrders}</h2><p>Total Orders</p></div>
            <div style={styles.cardYellow}><h2>{confirmed}</h2><p>Confirmed</p></div>
            <div style={styles.cardPurple}><h2>{shipped}</h2><p>Shipped</p></div>
            <div style={styles.cardOrange}><h2>{outForDelivery}</h2><p>Out for Delivery</p></div>
            <div style={styles.cardGreen}><h2>{delivered}</h2><p>Delivered</p></div>
          </div>
        )}

        {view === "orders" && (
          <>
            <h2>🧾 My Orders</h2>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Address</th>
                  <th style={styles.th}>City</th>
                  <th style={styles.th}>Pincode</th>
                  <th style={styles.th}>Payment Method</th>
                  <th style={styles.th}>Payment Status</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {myOrders.map((order) => {
                  const status =
                    order.status === "ORDER_PLACED"
                      ? "PENDING"
                      : order.status;

                  return (
                   <tr key={order.id}>
                   <td style={styles.td}>{order.id}</td>

                   {/* NAME (fallback to userName if needed) */}
                  <td style={styles.td}>{order.name || order.userName}</td>

                  {/* PHONE */}
                  <td style={styles.td}>{order.phone}</td>

                  {/* ADDRESS */}
                  <td style={styles.td}>{order.address}</td>

                  {/* CITY */}
                  <td style={styles.td}>{order.city}</td>

                  {/* PINCODE */}
                  <td style={styles.td}>{order.pincode}</td>

                  {/* PAYMENT METHOD */}
                  <td style={styles.td}>{order.paymentMethod}</td>

                  {/* PAYMENT STATUS */}
                  <td style={styles.td}>{order.paymentStatus}</td>

                  {/* TOTAL */}
                  <td style={styles.td}>₹{order.totalAmount}</td>

                  {/* STATUS */}
                  <td style={styles.td}>
                  <span style={styles.status}>{status}</span>
                  </td>

                  {/* ACTIONS */}
                  <td style={styles.td}>
                   {status === "PENDING" && (
                    <button
                       style={styles.confirmBtn}
                       onClick={() => updateStatus(order.id, "CONFIRMED")}
                    >
                       Confirm
                    </button>
                    )}

                   {status === "CONFIRMED" && (
                    <button
                       style={styles.shipBtn}
                       onClick={() => updateStatus(order.id, "SHIPPED")}
                    >
                       Ship
                    </button>
                    )}

                    {status === "SHIPPED" && (
                     <button
                        style={styles.outBtn}
                        onClick={() => updateStatus(order.id, "OUT_FOR_DELIVERY")}
                     >
                        Out
                     </button>
                     )}

                    {status === "OUT_FOR_DELIVERY" && (
                     <button
                        style={styles.deliverBtn}
                        onClick={() => updateStatus(order.id, "DELIVERED")}
                     >
                        Deliver
                     </button>
                    )}
                 </td>
               </tr>
             );
                })}
              </tbody>
            </table>
          </>
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

  main: {
    flex: 1,
    padding: "30px",
  },

  cardGrid: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },

  cardBlue: { background: "#2563eb", padding: "20px", borderRadius: "10px", flex: 1 },
  cardYellow: { background: "#eab308", padding: "20px", borderRadius: "10px", flex: 1 },
  cardPurple: { background: "#a855f7", padding: "20px", borderRadius: "10px", flex: 1 },
  cardOrange: { background: "#f97316", padding: "20px", borderRadius: "10px", flex: 1 },
  cardGreen: { background: "#16a34a", padding: "20px", borderRadius: "10px", flex: 1 },

  table: {
    width: "100%",
    marginTop: "15px",
    borderCollapse: "collapse",
    background: "#1e293b",
    textAlign: "center",
  },

  th: {
    padding: "12px",
    background: "#334155",
  },

  td: {
    padding: "12px",
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

  popup: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#22c55e",
    padding: "10px 20px",
    borderRadius: "8px",
  },
};