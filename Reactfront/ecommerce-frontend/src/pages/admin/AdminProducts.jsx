import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProducts = () => {
  const [view, setView] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  const [popup, setPopup] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  // ================= FETCH =================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/products",
        getAuthHeaders()
      );
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/categories",
        getAuthHeaders()
      );
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ================= IMAGE VALIDATION =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!validTypes.includes(file.type)) {
      setPopup("❌ Only JPG / PNG allowed");
      setTimeout(() => setPopup(""), 2000);
      return;
    }

    if (file.size > 1024 * 1024) {
      setPopup("❌ Image must be below 1MB");
      setTimeout(() => setPopup(""), 2000);
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ❌ REMOVE IMAGE (NEW FEATURE)
  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  // ================= UPLOAD =================
  const uploadImage = async () => {
    if (!imageFile) return "";

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await axios.post(
      "http://localhost:8080/api/admin/products/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  };

  // ================= SAVE =================
  const handleSubmit = async () => {
    try {
      let imageUrl = preview && !imageFile ? preview : "";

      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const payload = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        imageUrl,
        createdBy: userId,
      };

      if (editId) {
        await axios.put(
          `http://localhost:8080/api/admin/products/${editId}`,
          payload,
          getAuthHeaders()
        );
      } else {
        await axios.post(
          `http://localhost:8080/api/admin/products?categoryId=${form.categoryId}`,
          payload,
          getAuthHeaders()
        );
      }

      resetForm();
      fetchProducts();

      setPopup("🎉 Product saved!");
      setTimeout(() => {
        setPopup("");
        setView("list");
      }, 1200);
    } catch (err) {
      setPopup("❌ Save failed");
      setTimeout(() => setPopup(""), 1500);
    }
  };

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    await axios.delete(
      `http://localhost:8080/api/admin/products/${id}`,
      getAuthHeaders()
    );
    fetchProducts();
  };

  // ================= EDIT =================
  const editProduct = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      categoryId: p.category?.id || "",
    });

    setPreview(p.imageUrl);
    setImageFile(null);
    setEditId(p.id);
    setView("form");
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
    });

    setImageFile(null);
    setPreview(null);
    setEditId(null);
  };

  const myProducts = products.filter(
    (p) => String(p.createdBy) === String(userId)
  );

  return (
    <div style={styles.wrapper}>
      {popup && <div style={styles.popup}>{popup}</div>}

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2>📦 Admin Products</h2>

        <div onClick={() => setView("dashboard")} style={styles.item}>
          📊 Dashboard
        </div>

        <div onClick={() => setView("form")} style={styles.item}>
          ➕ Add Product
        </div>

        <div onClick={() => setView("list")} style={styles.item}>
          📋 View Products
        </div>

        <button onClick={() => setView("dashboard")} style={styles.backBtn}>
          ⬅ Back
        </button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <h1>Product Management</h1>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div style={styles.cardGrid}>
            <div style={styles.cardBlue}>
              <h2>{products.length}</h2>
              <p>Total Products</p>
            </div>
            <div style={styles.cardGreen}>
              <h2>{myProducts.length}</h2>
              <p>My Products</p>
            </div>
          </div>
        )}

        {/* FORM */}
        {view === "form" && (
          <div style={styles.formBox}>
            <input
              placeholder="Product Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={styles.input}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              style={styles.input}
            />

            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={styles.input}
            />

            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              style={styles.input}
            />

            {/* IMAGE */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={styles.input}
            />

            {/* PREVIEW + REMOVE */}
            {preview && (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img src={preview} style={styles.preview} />
                <button onClick={removeImage} style={styles.removeBtn}>
                  ❌
                </button>
              </div>
            )}

            {/* CATEGORY */}
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              style={styles.input}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button onClick={handleSubmit} style={styles.saveBtn}>
              {editId ? "Update" : "Save"}
            </button>

            <button onClick={resetForm} style={styles.cancelBtn}>
              Reset
            </button>
          </div>
        )}

        {/* LIST */}
        {view === "list" && (
          <>
            <h2>📦 All Products</h2>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <img src={p.imageUrl} style={styles.img} />
                    </td>
                    <td>{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock}</td>
                    <td>{p.category?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 style={{ marginTop: 30 }}>🧑 My Products</h2>

            {/* FIXED TABLE HEADER */}
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {myProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button onClick={() => editProduct(p)}>Edit</button>
                      <button onClick={() => deleteProduct(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;

/* ================= STYLES ================= */
const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "240px",
    background: "#111827",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },

  item: {
    padding: "12px",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "8px",
    background: "#1f2937",
  },

  backBtn: {
    marginTop: "-1px",
    background: "#1f2937",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    textAlign: "left",  
  },

  main: {
    flex: 1,
    padding: "30px",
  },

  cardGrid: {
    display: "flex",
    gap: "20px",
  },

  cardBlue: {
    background: "#2563eb",
    padding: "20px",
    borderRadius: "10px",
    flex: 1,
  },

  cardGreen: {
    background: "#16a34a",
    padding: "20px",
    borderRadius: "10px",
    flex: 1,
  },

  formBox: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "500px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },

  saveBtn: {
    background: "#22c55e",
    padding: "10px",
    border: "none",
    marginRight: "10px",
  },

  cancelBtn: {
    background: "#ef4444",
    padding: "10px",
    border: "none",
  },

  table: {
    width: "100%",
    marginTop: "15px",
    borderCollapse: "collapse",
    background: "#1e293b",
  },

  img: {
    width: "50px",
    height: "50px",
    objectFit: "cover",
    borderRadius: "6px",
  },

  preview: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },

  removeBtn: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "25px",
    height: "25px",
    cursor: "pointer",
    fontSize: "14px",
  },

  popup: {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#22c55e",
    color: "white",
    padding: "12px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    zIndex: 9999,
  },
};