import { useEffect, useState } from "react";
import {
  getCartItems,
  updateCartQty,
  removeCartItem
} from "../services/cartService";

import "./Cart.css";
import noImage from "../assets/no-image.png";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ TOKEN
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      loadCart();
    } else {
      console.error("User not logged in");
    }
  }, [token]);

  /* ✅ LOAD CART */
  const loadCart = async () => {
    setLoading(true);

    try {
      const data = await getCartItems();
      setCartItems(data || []);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ✅ SAFE IMAGE */
  const getImage = (img) => {
    if (!img || img.trim() === "") {
      return noImage;
    }
    return img;
  };

  /* ✅ INCREASE QTY */
  const increaseQty = async (item) => {
    try {
      await updateCartQty(item.id, item.quantity + 1);

      setCartItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ✅ DECREASE QTY */
  const decreaseQty = async (item) => {
    if (item.quantity <= 1) return;

    try {
      await updateCartQty(item.id, item.quantity - 1);

      setCartItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ✅ REMOVE ITEM */
  const removeItem = async (id) => {
    try {
      await removeCartItem(id);

      setCartItems((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ✅ TOTAL */
  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Cart</h2>

      {loading ? (
        <p className="empty-cart">Loading cart...</p>
      ) : !token ? (
        <p className="empty-cart">Please login to view cart</p>
      ) : cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty 😔</p>
      ) : (
        <>
          {cartItems.map((item) => {
            const price = item.product?.price || 0;

            return (
              <div className="cart-card" key={item.id}>
                
                {/* IMAGE */}
                <div className="cart-image">
                  <img
                    src={getImage(item.product?.imageUrl)}
                    alt={item.product?.name || "product"}
                  />
                </div>

                {/* INFO */}
                <div className="cart-info">
                  <h3>{item.product?.name || "No Name"}</h3>
                  <p>Price: ₹{price}</p>
                  <p className="item-total">
                    Total: ₹{price * item.quantity}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="cart-actions">
                  <button onClick={() => decreaseQty(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item)}>+</button>
                </div>

                {/* REMOVE */}
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                >
                  ❌ Remove
                </button>
              </div>
            );
          })}

          {/* TOTAL SECTION */}
          <div className="cart-total">
            <h2>Total: ₹{getTotal()}</h2>

            <div className="cart-buttons">
              <button
                className="checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              {/* ORDER HISTORY BUTTON */}
              <button
                className="history-btn"
                onClick={() => navigate("/orders")}
              >
                📦 Order History
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;