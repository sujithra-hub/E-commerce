import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrdersAPI } from "../services/orderService";

export default function OrderHistory() {

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrdersAPI();
       console.log("ORDERS DATA:", data);
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px"
          }}>
            <p><b>Order ID:</b> {order.id}</p>
            <p><b>Total:</b> ₹{order.totalAmount}</p>
            <p><b>Status:</b> {order.status}</p>

            <button onClick={() => {
               console.log("CLICK ORDER ID:", order.id);
               navigate(`/orders/${order.id}`);
            }}>
               View Details
            </button>
          </div>
        ))
      )}
    </div>
  );
}