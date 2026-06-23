import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartItems } from "../services/cartService";
import axios from "axios";
import "./Checkout.css";

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [payment, setPayment] = useState("COD");

  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  // ================= LOAD CART =================
  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await getCartItems();
      setCartItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= TOTAL =================
  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  // ================= INPUT =================
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // ================= PLACE ORDER =================
  const placeOrder = async () => {
    if (
      !address.name ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.pincode
    ) {
      alert("⚠️ Please fill all delivery details");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const orderData = {
        name: address.name,
        phone: address.phone,
        address: address.address,
        city: address.city,
        pincode: address.pincode,
        paymentMethod: payment,
        totalAmount: getTotal(),
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      console.log("FINAL ORDER DATA:", orderData);

      await axios.post(
        "http://localhost:8080/api/orders/checkout",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("🎉 Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      console.error("Order error:", err);
      alert("❌ Failed to place order");
    }
  };

  // ================= UI =================
  return (
    <div className="checkout-container">
      <h2>🧾 Checkout</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <div className="checkout-grid">

          <div className="checkout-box">
            <h3>📍 Delivery Address</h3>

            <input name="name" placeholder="Full Name" onChange={handleChange} />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} />
            <textarea name="address" placeholder="Address" onChange={handleChange} />
            <input name="city" placeholder="City" onChange={handleChange} />
            <input name="pincode" placeholder="Pincode" onChange={handleChange} />
          </div>

          <div className="checkout-box">
            <h3>💳 Payment Method</h3>

            <label>
              <input
                type="radio"
                value="COD"
                checked={payment === "COD"}
                onChange={(e) => setPayment(e.target.value)}
              />
              Cash on Delivery
            </label>

            <label>
              <input
                type="radio"
                value="ONLINE"
                checked={payment === "ONLINE"}
                onChange={(e) => setPayment(e.target.value)}
              />
              UPI / Card / Net Banking
            </label>
          </div>

          <div className="checkout-box">
            <h3>🛍️ Order Summary</h3>

            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <span>{item.product?.name}</span>
                <span>₹{item.product?.price} × {item.quantity}</span>
              </div>
            ))}

            <hr />
            <h3>Total: ₹{getTotal()}</h3>

            <button className="place-btn" onClick={placeOrder}>
              ✅ Place Order
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

export default Checkout;

/* 🔥 STYLES INSIDE JS */
const box = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
};

const input = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const paymentStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginTop: "12px",
  cursor: "pointer",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "10px",
};

const btn = {
  width: "100%",
  marginTop: "20px",
  padding: "12px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};