import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ProductReviews from "../components/ProductReviews";

const BASE_URL = "http://localhost:8080";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const token = localStorage.getItem("token");

  // ✅ SEARCH QUERY (INSIDE COMPONENT)
  const query = new URLSearchParams(location.search);
  const searchQuery = query.get("search") || "";

  // ✅ FILTER PRODUCTS
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ✅ ADD TO CART */
  const handleAddToCart = async (id) => {
    try {
      await axios.post(
        `${BASE_URL}/api/cart/add/${id}?quantity=1`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const product = products.find((p) => p.id === id);
      setToast(`${product?.name || "Product"} added to cart 🛒`);

      setTimeout(() => setToast(null), 2000);
    } catch (err) {
      console.log(err);
    }
  };

  /* ✅ SAFE IMAGE */
  const getImage = (p) => {
    const img = p.image || p.imageUrl || p.img || p.imagePath;

    if (!img) return "https://via.placeholder.com/300";
    if (img.startsWith("http")) return img;

    return `${BASE_URL}/${img}`;
  };

  return (
    <div>
      {/* HERO */}
      <div style={styles.hero}>
        <h1>🔥 Big Deals of the Day</h1>
        <p>Up to 70% OFF on Electronics & Fashion</p>
      </div>

      {/* ✅ TITLE CHANGES BASED ON SEARCH */}
      <h2 style={styles.sectionTitle}>
        {searchQuery
          ? `🔍 Results for "${searchQuery}"`
          : "⭐ Featured Products"}
      </h2>

      <div style={styles.grid}>
        {(searchQuery ? filteredProducts : products.slice(0, 4)).map((p) => (
          <div key={p.id} style={styles.card}>
            <img src={getImage(p)} alt={p.name} style={styles.image} />

            <h3>{p.name}</h3>
            <p>₹ {p.price}</p>

            <button
              style={styles.viewBtn}
              onClick={() => setSelectedProduct(p)}
            >
              View
            </button>

            <button
              style={styles.cartBtn}
              onClick={() => handleAddToCart(p.id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* ❌ NO RESULTS MESSAGE */}
      {searchQuery && filteredProducts.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          ❌ No products found
        </p>
      )}

      {/* BEST SELLERS ONLY WHEN NO SEARCH */}
      {!searchQuery && (
        <>
          <h2 style={styles.sectionTitle}>🔥 Best Sellers</h2>

          <div style={styles.grid}>
            {products.slice(4, 8).map((p) => (
              <div key={p.id} style={styles.card}>
                <img src={getImage(p)} alt={p.name} style={styles.image} />

                <h3>{p.name}</h3>
                <p>₹ {p.price}</p>

                <button
                  style={styles.viewBtn}
                  onClick={() => setSelectedProduct(p)}
                >
                  View
                </button>

                <button
                  style={styles.cartBtn}
                  onClick={() => handleAddToCart(p.id)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODAL */}
      {selectedProduct && (
        <div style={styles.overlay} onClick={() => setSelectedProduct(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              style={styles.closeBtn}
              onClick={() => setSelectedProduct(null)}
            >
              ✖
            </button>

            <div style={styles.modalContent}>
              <img
                src={getImage(selectedProduct)}
                alt={selectedProduct.name}
                style={styles.modalImg}
              />

              <div style={styles.modalRight}>
                <h2>{selectedProduct.name}</h2>
                <p style={styles.price}>₹{selectedProduct.price}</p>

                <p style={styles.desc}>
                  {selectedProduct.description || "No description available"}
                </p>

                <button
                  style={styles.cartBtn}
                  onClick={() => handleAddToCart(selectedProduct.id)}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>

            <div style={styles.reviewSection}>
              <ProductReviews productId={selectedProduct.id} />
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
};
export default Home;
/* 🎨 STYLES */
const styles = {
  hero: {
    textAlign: "center",
    padding: "40px",
    background: "linear-gradient(to right, #ff9800, #ff5722)",
    color: "white",
  },

  sectionTitle: {
    margin: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    padding: "20px",
  },

  card: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  viewBtn: {
    marginRight: "10px",
    padding: "6px 10px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  cartBtn: {
    padding: "6px 10px",
    backgroundColor: "orange",
    border: "none",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "900px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },

  closeBtn: {
    position: "absolute",
    right: "10px",
    top: "10px",
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
  },

  modalContent: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  modalImg: {
    width: "300px",
    borderRadius: "10px",
  },

  modalRight: {
    flex: 1,
    minWidth: "250px",
  },

  desc: {
    marginTop: "10px",
    color: "#555",
  },

  price: {
    color: "green",
    fontWeight: "bold",
  },

  reviewSection: {
    marginTop: "20px",
  },

  /* ✅ TOAST STYLE */
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

