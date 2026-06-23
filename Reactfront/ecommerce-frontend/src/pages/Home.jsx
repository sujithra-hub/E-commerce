import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToCart = async (id) => {
    await axios.post(
      `http://localhost:8080/api/cart/add/${id}?quantity=1`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Added to cart 🛒");
  };

  return (
    <div>
      

      {/* 🌟 HERO BANNER */}
      <div style={styles.hero}>
        <h1>🔥 Big Deals of the Day</h1>
        <p>Up to 70% OFF on Electronics & Fashion</p>
        <button onClick={() => navigate("/categories")}>
          Shop Now
        </button>
      </div>

      {/* 📦 CATEGORIES STRIP */}
      <div style={styles.categories}>
        <div>📱 Electronics</div>
        <div>👕 Fashion</div>
        <div>💄 Beauty</div>
        <div>📚 Books</div>
        <div>🏀 Sports</div>
      </div>

      {/* ⭐ FEATURED PRODUCTS */}
      <h2 style={styles.sectionTitle}>⭐ Featured Products</h2>

      <div style={styles.grid}>
        {products.slice(0, 4).map((p) => (
          <div key={p.id} style={styles.card}>
            <h3>{p.name}</h3>
            <p>₹ {p.price}</p>

            <button
              style={styles.viewBtn}
              onClick={() => navigate(`/product/${p.id}`)}
            >
              View
            </button>

            <button
              style={styles.cartBtn}
              onClick={() => handleAddToCart(p.id)}
            >
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 BEST SELLERS */}
      <h2 style={styles.sectionTitle}>🔥 Best Sellers</h2>

      <div style={styles.grid}>
        {products.slice(4, 8).map((p) => (
          <div key={p.id} style={styles.card}>
            <h3>{p.name}</h3>
            <p>₹ {p.price}</p>

            <button
              style={styles.viewBtn}
              onClick={() => navigate(`/product/${p.id}`)}
            >
              View
            </button>

            <button
              style={styles.cartBtn}
              onClick={() => handleAddToCart(p.id)}
            >
              Add to Cart 🛒
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
const styles = {
  hero: {
    textAlign: "center",
    padding: "40px",
    background: "linear-gradient(to right, #ff9800, #ff5722)",
    color: "white",
    marginBottom: "20px",
  },

  categories: {
    display: "flex",
    justifyContent: "space-around",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
  },

  sectionTitle: {
    marginLeft: "20px",
    marginTop: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
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

  viewBtn: {
    marginRight: "10px",
    padding: "5px 10px",
    cursor: "pointer",
  },

  cartBtn: {
    padding: "5px 10px",
    backgroundColor: "orange",
    border: "none",
    cursor: "pointer",
    color: "white",
  },
};

export default Home;