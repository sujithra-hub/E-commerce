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

import ProductReviews from "../components/ProductReviews";

/* SAFE IMAGE */
const getImage = (img) => {
  if (!img || typeof img !== "string") return noImage;
  return img;
};

/* PRODUCT CARD */
const ProductCard = memo(({ p, onAdd, onWishlist, isWished, onView }) => {
  const [wish, setWish] = useState(false);

  useEffect(() => setWish(isWished), [isWished]);

  return (
    <div style={styles.card}>
      <div style={styles.imageWrapper}>
        <img src={getImage(p.imageUrl)} style={styles.image} />

        <button
          style={styles.wishBtn}
          onClick={() => {
            const s = !wish;
            setWish(s);
            onWishlist(p, s);
          }}
        >
          {wish ? "❤️" : "🤍"}
        </button>
      </div>

      <div style={styles.content}>
        <h3 style={styles.title}>{p.name}</h3>
        <p style={styles.price}>₹{p.price}</p>

        <div style={styles.actions}>
          <button style={styles.viewBtn} onClick={() => onView(p)}>
            View
          </button>

          <button style={styles.cartBtn} onClick={() => onAdd(p.id)}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
});

/* MAIN */
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedId, setAddedId] = useState(null);

  const [toast, setToast] = useState(null); // ✅ NEW

  const { categoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getWishlistAPI().then(setWishlist);
  }, []);

  useEffect(() => {
    (categoryId
      ? getProductsByCategory(categoryId)
      : getProducts()
    ).then(setProducts);
  }, [categoryId]);

  const handleWishlist = async (p, state) => {
    if (state) await addToWishlistAPI(p.id);
    else await removeWishlistAPI(p.id);
    setWishlist(await getWishlistAPI());
  };

  const isWished = (id) =>
    wishlist.some((w) => (w.productId || w.id) === id);

  /* ✅ ADD TO CART WITH POPUP */
  const handleAdd = async (id) => {
    try {
      await addToCart(id, 1);

      const product = products.find((p) => p.id === id);

      setAddedId(id);

      // ✅ SHOW POPUP
      setToast(`${product?.name || "Product"} added to cart 🛒`);

      setTimeout(() => setToast(null), 2000);
      setTimeout(() => setAddedId(null), 1500);

    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.backBtn} onClick={() => navigate("/categories")}>
        ⬅ Back
      </button>

      <div style={styles.grid}>
        {products.map((p) => (
          <ProductCard
            key={p.id}
            p={p}
            onAdd={handleAdd}
            onWishlist={handleWishlist}
            isWished={isWished(p.id)}
            onView={setSelectedProduct}
          />
        ))}
      </div>

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
                src={getImage(selectedProduct.imageUrl)}
                style={styles.modalImg}
              />

              <div style={styles.modalRight}>
                <h2>{selectedProduct.name}</h2>
                <p style={styles.price}>₹{selectedProduct.price}</p>
                <p style={styles.desc}>{selectedProduct.description}</p>

                <button
                  style={styles.cartBtn}
                  onClick={() => handleAdd(selectedProduct.id)}
                >
                  {addedId === selectedProduct.id
                    ? "✅ Added"
                    : "🛒 Add to Cart"}
                </button>
              </div>
            </div>

            <div style={styles.reviewSection}>
              <ProductReviews productId={selectedProduct.id} />
            </div>
          </div>
        </div>
      )}

      {/* ✅ TOAST POPUP */}
      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "auto",
  },

  backBtn: {
    marginBottom: 20,
    padding: "8px 14px",
    borderRadius: 6,
    border: "none",
    background: "#333",
    color: "#fff",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  card: {
    borderRadius: "12px",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },

  wishBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "#fff",
    border: "none",
    borderRadius: "50%",
    padding: "6px",
    cursor: "pointer",
  },

  content: {
    padding: "15px",
  },

  title: {
    fontSize: "16px",
  },

  price: {
    color: "green",
    fontWeight: "bold",
  },

  actions: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },

  viewBtn: {
    flex: 1,
    padding: "8px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  cartBtn: {
    flex: 1,
    padding: "8px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: 6,
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
    borderRadius: 12,
    width: "90%",
    maxWidth: "900px",
    padding: 20,
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  },

  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    border: "none",
    background: "transparent",
    fontSize: 20,
    cursor: "pointer",
  },

  modalContent: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap",
  },

  modalImg: {
    width: "300px",
    borderRadius: 10,
  },

  modalRight: {
    flex: 1,
    minWidth: "250px",
  },

  desc: {
    margin: "10px 0",
    color: "#555",
  },

  reviewSection: {
    marginTop: 20,
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