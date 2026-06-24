import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getWishlistAPI,
  removeWishlistAPI,
} from "../services/wishlistService";

import { getProducts } from "../services/productService";
import { addToCart } from "../services/cartService";

const BASE_URL = "http://localhost:8080";

/* SAFE IMAGE */
const getImage = (img) => {
  if (!img || typeof img !== "string") return null;

  const trimmed = img.trim();
  if (trimmed === "") return null;

  return trimmed.startsWith("http")
    ? trimmed
    : `${BASE_URL}${trimmed}`;
};

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(null); // ✅ NEW

  const navigate = useNavigate();

  /* LOAD WISHLIST */
  const loadWishlist = async () => {
    try {
      const data = await getWishlistAPI();
      setWishlist(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* LOAD PRODUCTS */
  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadWishlist();
    loadProducts();
  }, []);

  /* MAP PRODUCT */
  const getProduct = (productId) => {
    return products.find((p) => p.id === productId);
  };

  /* REMOVE FROM WISHLIST */
  const removeItem = async (productId) => {
    try {
      await removeWishlistAPI(productId);

      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ✅ ADD TO CART WITH POPUP */
  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);

      const product = getProduct(productId);

      // ✅ SHOW POPUP
      setToast(`${product?.name || "Product"} added to cart 🛒`);

      setTimeout(() => setToast(null), 2000);

    } catch (err) {
      console.error(err);
      alert("❌ Failed to add to cart");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>❤️ My Wishlist</h2>

      {wishlist.length === 0 ? (
        <div style={styles.empty}>
          <h3>No items yet 😢</h3>
          <button onClick={() => navigate("/categories")}>
            🛍️ Start Shopping
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {wishlist.map((item) => {
            const product = getProduct(item.productId);

            return (
              <div key={item.id} style={styles.card}>
                
                {/* IMAGE */}
                <div style={styles.imgBox}>
                  {getImage(product?.imageUrl) ? (
                    <img
                      src={getImage(product.imageUrl)}
                      alt={product?.name}
                      style={styles.img}
                    />
                  ) : (
                    <div style={styles.noImage}>
                      No Image
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div style={styles.content}>
                  <h3>{product?.name || "Loading..."}</h3>

                  <p style={styles.price}>
                    ₹{product?.price || 0}
                  </p>

                  {/* BUTTONS */}
                  <div style={styles.btnRow}>
                    <button
                      style={styles.cartBtn}
                      onClick={() => handleAddToCart(item.productId)}
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      style={styles.removeBtn}
                      onClick={() => removeItem(item.productId)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ✅ TOAST POPUP */}
      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

export default WishlistPage;

/* 🎨 STYLES */
const styles = {
  container: {
    padding: "20px",
    background: "#f6f8fb",
    minHeight: "100vh",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  imgBox: {
    height: "160px",
    background: "#eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  noImage: {
    color: "#777",
    fontSize: "14px",
  },

  content: {
    padding: "10px",
  },

  price: {
    color: "green",
    fontWeight: "bold",
  },

  btnRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  cartBtn: {
    flex: 1,
    padding: "8px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  removeBtn: {
    flex: 1,
    padding: "8px",
    background: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  empty: {
    textAlign: "center",
    marginTop: "80px",
  },

  /* ✅ TOAST */
  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#333",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    zIndex: 1000,
  },
};