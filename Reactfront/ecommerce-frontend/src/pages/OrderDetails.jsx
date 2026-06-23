import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderByIdAPI } from "../services/orderService";

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);   // ✅ added
  const [error, setError] = useState("");         // ✅ added

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const data = await getOrderByIdAPI(id);
      setOrder(data);
    } catch (err) {
      console.error("Error fetching order", err);

      // ✅ handle 403 specifically
      if (err.response?.status === 403) {
        setError("You are not allowed to view this order");
      } else {
        setError("Failed to load order");
      }
    } finally {
      setLoading(false); // ✅ important
    }
  };

  const steps = [
    "ORDER_PLACED",
    "CONFIRMED",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED"
  ];

  // ✅ UI handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!order) return <p>No order found</p>;

  const currentIndex = steps.indexOf(order.status);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Order Details</h2>

      <p><b>Order ID:</b> {order.id}</p>
      <p><b>Status:</b> {order.status}</p>
      <p><b>Total:</b> ₹{order.totalAmount}</p>

      <h3>Items</h3>
      {order.items?.map(item => (
        <div key={item.id}>
          <p>{item.productName}</p>
          <p>Qty: {item.quantity}</p>
          <p>₹{item.price}</p>
        </div>
      ))}

      <h3>Delivery</h3>
      <p>{order.name}</p>
      <p>{order.address}</p>
      <p>{order.city} - {order.pincode}</p>

      <h3>Payment</h3>
      <p>{order.paymentStatus}</p>
      <p>{order.paymentMethod}</p>

      <h3>Tracking</h3>
      <div style={{ display: "flex", gap: "10px" }}>
        {steps.map((step, index) => (
          <div
            key={step}
            style={{
              padding: "10px",
              borderRadius: "5px",
              background: index <= currentIndex ? "green" : "gray",
              color: "white"
            }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}