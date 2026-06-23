import { useEffect, useState, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProducts,
  getProductsByCategory,
} from "../services/productService";
import { addToCart } from "../services/cartService";
import noImage from "../assets/no-image.png";

import {
  addToWishlistAPI,
  removeWishlistAPI,
  getWishlistAPI,
} from "../services/wishlistService";

/* SAFE IMAGE */
const getImage = (img) => {
  if (!img || typeof img !== "string" || img.trim() === "") {
    return noImage;
  }
  return img.startsWith("http") ? img : img;
};

/* ⭐ PRODUCT CARD */
const ProductCard = memo(({ p, onAdd, onWishlist, isWished }) => {
  const [wish, setWish] = useState(false);

  useEffect(() => {
    setWish(isWished);
  }, [isWished]);

  const toggleWishlist = () => {
    const newState = !wish;
    setWish(newState);
    onWishlist?.(p, newState);
  };

  const renderStars = (rating = 0) => {
    const value = Math.round(Number(rating || 0));
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= value ? "#f5a623" : "#ddd",
            fontSize: "15px",
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const ratingValue = Number(p.avgRating ?? p.averageRating ?? p.rating ?? 0);

  return (
    <div style={styles.card}>

      <div style={styles.imageWrapper}>
        <img src={getImage(p.imageUrl)} alt={p.name} style={styles.image} />

        <button style={styles.wishBtn} onClick={toggleWishlist}>
          {wish ? "❤️" : "🤍"}
        </button>

        {p.isNew && <div style={styles.badge}>🔥 New</div>}
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{p.name}</h3>

        <p style={styles.price}>₹{p.price}</p>

        <p style={styles.desc}>{p.description}</p>

        <div style={styles.rating}>
          {renderStars(ratingValue)}
          <span style={{ marginLeft: "6px", color: "#666" }}>
            ({ratingValue.toFixed(1)})
          </span>
        </div>

        <button style={styles.cartBtn} onClick={() => onAdd(p.id)}>
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
});

/* 🧾 MAIN PAGE */
function ProductList() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { categoryId } = useParams();

  /* LOAD WISHLIST */
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await getWishlistAPI();
        setWishlist(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    loadWishlist();
  }, []);

  /* LOAD PRODUCTS */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = categoryId
          ? await getProductsByCategory(categoryId)
          : await getProducts();

        setProducts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [categoryId]);

  /* ADD TO CART */
  const handleAddToCart = async (id) => {
    try {
      await addToCart(id, 1);
      setToast("🛒 Added to cart!");
      setTimeout(() => setToast(""), 2000);
    } catch (err) {
      setToast("❌ Failed");
      setTimeout(() => setToast(""), 2000);
    }
  };

  /* ❤️ WISHLIST FIX */
  const handleWishlist = async (product, state) => {
    try {
      const productId = product.id;

      const exists = wishlist.some(
        (w) => Number(w.productId ?? w.id) === Number(productId)
      );

      if (state && !exists) {
        await addToWishlistAPI(productId);
      }

      if (!state && exists) {
        await removeWishlistAPI(productId);
      }

      const updated = await getWishlistAPI();
      setWishlist(updated || []);
    } catch (err) {
      console.error("wishlist error", err);
    }
  };

  /* CHECK HEART STATE */
  const isWished = (id) =>
    wishlist.some((w) => Number(w.productId ?? w.id) === Number(id));

  return (
    <div style={styles.container}>

      {toast && <div style={styles.toast}>{toast}</div>}

      <div style={styles.header}>
        <h2>🛍️ Products</h2>

        <button style={styles.backBtn} onClick={() => navigate("/categories")}>
          ⬅ Back
        </button>
      </div>

      <div style={styles.grid}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              onAdd={handleAddToCart}
              onWishlist={handleWishlist}
              isWished={isWished(p.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;

/* 🎨 STYLES */
const styles = {
  container: {
    padding: "20px",
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  backBtn: {
    padding: "10px 20px",
    background: "#ff9800",
    border: "none",
    color: "#fff",
    borderRadius: "8px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "440px",
  },

  imageWrapper: {
    position: "relative",
    width: "100%",
    aspectRatio: "4 / 3",
    background: "#eee",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  wishBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "none",
    background: "#fff",
    cursor: "pointer",
  },

  badge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "red",
    color: "#fff",
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "6px",
  },

  content: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },

  title: { fontSize: "16px" },
  price: { color: "green", fontWeight: "bold" },

  desc: {
    fontSize: "13px",
    color: "#666",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  rating: {
    marginTop: "6px",
    display: "flex",
    alignItems: "center",
  },

  cartBtn: {
    marginTop: "auto",
    background: "#ff9800",
    border: "none",
    padding: "10px",
    color: "#fff",
    borderRadius: "10px",
    cursor: "pointer",
  },

  toast: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#333",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "8px",
    zIndex: 999,
  },
};