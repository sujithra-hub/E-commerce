import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminCategories = () => {
  const [view, setView] = useState("dashboard");
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

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

  // ================= SAVE =================
  const handleSubmit = async () => {
    const payload = { ...form, createdBy: userId };

    try {
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

  const editCategory = (cat) => {
    setForm({ name: cat.name, description: cat.description });
    setEditId(cat.id);
    setView("form");
  };

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setEditId(null);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const myCategories = categories.filter(
    (c) => String(c.createdBy) === String(userId)
  );

  return (
    <div style={styles.wrapper}>
      {/* ================= SIDEBAR ================= */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>📦 Admin</h2>

        <div
          style={view === "dashboard" ? styles.activeItem : styles.item}
          onClick={() => setView("dashboard")}
        >
          📊 Dashboard
        </div>

        <div
          style={view === "form" ? styles.activeItem : styles.item}
          onClick={() => setView("form")}
        >
          ➕ Add Category
        </div>

        <div
          style={view === "list" ? styles.activeItem : styles.item}
          onClick={() => setView("list")}
        >
          📋 View Categories
        </div>
         <div style={{ marginTop: "20px" }}>
      <button
  style={{
    background: "#1f2937",
    color: "white",
     marginTop: "-10px",
    padding: "15px",
    width: "100%",          // important for sidebar look
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    textAlign: "left",      // 👈 aligns text to left
    paddingLeft: "20px",    // 👈 gives proper spacing
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }}
  onClick={() => setView("dashboard")}
>
  ⬅ Back
</button>
    </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div style={styles.main}>
        <h1 style={styles.title}>Category Management</h1>

        {/* ================= DASHBOARD ================= */}
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

        {/* ================= FORM ================= */}
        {view === "form" && (
          <div style={styles.formBox}>
            <h2>{editId ? "✏️ Update Category" : "➕ Create Category"}</h2>

            <input
              style={styles.input}
              placeholder="Category Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <textarea
              style={styles.textarea}
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

        {/* ================= LIST ================= */}
        {view === "list" && (
          <div>
            {/* TOTAL */}
            <h2>📊 Total Categories</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
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

            {/* MY */}
            <h2 style={{ marginTop: 30 }}>🧑 My Categories</h2>

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
                {myCategories.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.description}</td>
                    <td>
                      <button
                        style={styles.editBtn}
                        onClick={() => editCategory(c)}
                      >
                        Edit
                      </button>

                      <button
                        style={styles.deleteBtn}
                        onClick={() => deleteCategory(c.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    background: "#0f172a",
    color: "white",
    fontFamily: "Arial",
  },

  sidebar: {
    width: "220px",
    background: "#111827",
    padding: "20px",
  },

  logo: {
    marginBottom: "20px",
  },

  item: {
    padding: "12px",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "8px",
    background: "#1f2937",
  },

  activeItem: {
    padding: "12px",
    marginBottom: "10px",
    cursor: "pointer",
    borderRadius: "8px",
    background: "#3b82f6",
  },

  main: {
    flex: 1,
    padding: "30px",
  },

  title: {
    marginBottom: "20px",
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
    maxWidth: "450px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },

  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
  },

  saveBtn: {
    background: "#22c55e",
    padding: "10px",
    border: "none",
    marginRight: "10px",
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#ef4444",
    padding: "10px",
    border: "none",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    marginTop: "15px",
    borderCollapse: "collapse",
    background: "#1e293b",
  },

  editBtn: {
    background: "#facc15",
    marginRight: "5px",
    border: "none",
    padding: "5px",
  },

  deleteBtn: {
    background: "#ef4444",
    border: "none",
    padding: "5px",
    color: "white",
  },
};