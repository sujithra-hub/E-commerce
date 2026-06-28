import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AdminCategories = () => {
  const [view, setView] = useState("dashboard");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  // ================= GET USER ID FROM TOKEN (LIKE PRODUCTS) =================
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId || decoded.id;
    } catch (err) {
      console.log("Invalid token");
    }
  }

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` },
  });

  // ================= FETCH =================
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/categories",
        getAuthHeaders()
      );
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ================= SAVE (CREATE / UPDATE) =================
  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name,
        description: form.description,
        createdBy: userId, // 🔥 THIS WILL GO TO DB
      };

      if (editId) {
        await axios.put(
          `http://localhost:8080/api/admin/categories/${editId}`,
          payload,
          getAuthHeaders()
        );
      } else {
        await axios.post(
          "http://localhost:8080/api/admin/categories",
          payload,
          getAuthHeaders()
        );
      }

      resetForm();
      fetchCategories();
      setView("dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  // ================= DELETE =================
  const deleteCategory = async (id) => {
    await axios.delete(
      `http://localhost:8080/api/admin/categories/${id}`,
      getAuthHeaders()
    );
    fetchCategories();
  };

  // ================= EDIT =================
  const editCategory = (cat) => {
    setForm({
      name: cat.name,
      description: cat.description,
    });
    setEditId(cat.id);
    setView("form");
  };

  // ================= RESET =================
  const resetForm = () => {
    setForm({ name: "", description: "" });
    setEditId(null);
  };

  // ================= FILTER MY CATEGORIES =================
  const myCategories = categories.filter((c) => {
  const createdBy = c.createdBy;

  if (!createdBy || !userId) return false;

  // if backend sends object or id both handled
  if (typeof createdBy === "object") {
    return String(createdBy.id) === String(userId);
  }

  return String(createdBy) === String(userId);
});

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2>📦 Admin Categories</h2>

        <div onClick={() => setView("dashboard")} style={styles.item}>
          📊 Dashboard
        </div>

        <div onClick={() => setView("form")} style={styles.item}>
          ➕ Add Category
        </div>

        <div onClick={() => setView("list")} style={styles.item}>
          📋 View Categories
        </div>

        <button onClick={() => setView("dashboard")} style={styles.backBtn}>
          ⬅ Back
        </button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <h1>Category Management</h1>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div style={styles.cardGrid}>
            <div style={styles.cardBlue}>
              <h2>{categories.length}</h2>
              <p>Total Categories</p>
            </div>

            <div style={styles.cardGreen}>
              <h2>{myCategories.length}</h2>
              <p>My Categories</p>
            </div>
          </div>
        )}

        {/* FORM */}
        {view === "form" && (
          <div style={styles.formBox}>
            <h2>{editId ? "Update Category" : "Create Category"}</h2>

            <input
              style={styles.input}
              placeholder="Category Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <textarea
              style={styles.input}
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <button style={styles.saveBtn} onClick={handleSubmit}>
              {editId ? "Update" : "Save"}
            </button>

            <button style={styles.cancelBtn} onClick={resetForm}>
              Reset
            </button>
          </div>
        )}

        {/* LIST */}
        {view === "list" && (
          <>
            <h2>All Categories</h2>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 style={{ marginTop: 30 }}>My Categories</h2>

            <table style={styles.table}>
              <tbody>
                {myCategories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.description}</td>
                    <td>
                      <button onClick={() => editCategory(c)}>Edit</button>
                      <button onClick={() => deleteCategory(c.id)}>
                        Delete
                      </button>
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

export default AdminCategories;

/* ================= STYLES ================= */
const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f4f6f9", // soft neutral (formal)
    color: "#1e293b",
    fontFamily: "Inter, Poppins, sans-serif",
  },

  /* SIDEBAR */
  sidebar: {
    width: "240px",
    background: "#1e293b", // deep navy (not pure black)
    padding: "22px",
    color: "#cbd5e1",
    borderRight: "1px solid rgba(255,255,255,0.05)",
  },

  logo: {
    marginBottom: "35px",
    fontSize: "20px",
    fontWeight: "600",
    color: "#e2e8f0",
    letterSpacing: "0.5px",
  },

  item: {
    padding: "12px 14px",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "10px",
    background: "transparent",
    transition: "all 0.25s ease",
  },

  activeItem: {
    padding: "12px 14px",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "10px",
    background: "#1d4ed8", // controlled accent
    color: "#fff",
    boxShadow: "0 4px 12px rgba(29,78,216,0.35)",
  },

  /* MAIN AREA */
  main: {
    flex: 1,
    padding: "30px",
  },

  title: {
    marginBottom: "25px",
    fontSize: "26px",
    fontWeight: "600",
    color: "#0f172a",
  },

  /* KPI CARDS */
  cardGrid: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },

  cardBlue: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "14px",
    flex: 1,
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
  },

  cardGreen: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "14px",
    flex: 1,
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
  },

  /* FORM SECTION */
  formBox: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "14px",
    maxWidth: "450px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    fontSize: "14px",
    outline: "none",
  },

  textarea: {
    width: "100%",
    height: "90px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
  },

  /* BUTTONS */
  saveBtn: {
    background: "#1d4ed8",
    color: "#fff",
    padding: "10px 18px",
    border: "none",
    marginRight: "10px",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "500",
    letterSpacing: "0.3px",
  },

  cancelBtn: {
    background: "#e2e8f0",
    color: "#0f172a",
    padding: "10px 18px",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
  },

  /* TABLE */
  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
    background: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },

  th: {
    padding: "14px",
    background: "#f8fafc",
    color: "#475569",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.3px",
  },

  td: {
    padding: "12px",
    borderTop: "1px solid #f1f5f9",
    fontSize: "14px",
  },

  /* ACTION BUTTONS */
  editBtn: {
    background: "#facc15",
    marginRight: "6px",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#ef4444",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  /* BACK BUTTON */
  backBtn: {
    marginTop: "12px",
    background: "#f1f5f9",
    color: "#0f172a",
    padding: "10px 15px",
    width: "100%",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "8px",
    fontSize: "15px",
  },
};