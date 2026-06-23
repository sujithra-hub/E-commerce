import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getWishlistAPI,
  removeWishlistAPI,
} from "../services/wishlistService";

import { getProducts } from "../services/productService";

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

  /* REMOVE */
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

                  <button
                    style={styles.removeBtn}
                    onClick={() => removeItem(item.productId)}
                  >
                    ❌ Remove
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
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

  removeBtn: {
    marginTop: "10px",
    padding: "8px",
    width: "100%",
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
};