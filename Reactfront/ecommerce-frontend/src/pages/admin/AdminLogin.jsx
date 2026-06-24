import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        form
      );

      console.log("ADMIN LOGIN RESPONSE:", res.data);

      // -------------------------------
      // GET TOKEN
      // -------------------------------
      const token = res.data?.token || res.data;

      if (!token) {
        alert("Login failed: No token received");
        return;
      }

      // -------------------------------
      // DECODE JWT
      // -------------------------------
      let payload = {};
      let role = null;
      let adminId = null;

      try {
        payload = JSON.parse(atob(token.split(".")[1]));

        role = payload.role || "admin"; // default admin
        adminId = payload.adminId || payload.id || null;
      } catch (err) {
        console.log("JWT decode failed:", err);
        role = "admin"; // fallback safety
      }

      // -------------------------------
      // FORCE ADMIN LOGIN ONLY
      // -------------------------------
      if (role && role.toLowerCase() !== "admin") {
        alert("Access denied: Only admins allowed here");
        return;
      }

      // -------------------------------
      // STORE DATA
      // -------------------------------
      localStorage.setItem("token", token);
      localStorage.setItem("role", "admin"); // IMPORTANT
      if (adminId) localStorage.setItem("adminId", adminId);

      alert("Admin login successful");

      navigate("/admin/dashboard"); // change if your route differs
    } catch (err) {
      console.log("ADMIN LOGIN ERROR:", err);
      alert("Login failed. Check backend or credentials.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Don't have an Account?
        </p>

        <button
          type="button"
          style={styles.registerBtn}
          onClick={() => navigate("/admin/register")}
        >
          Register Here
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

/* ================= STYLES ================= */

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#111827",
  },

  card: {
    padding: "30px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)",
    width: "300px",
    display: "flex",
    flexDirection: "column",
  },

  title: {
    marginBottom: "20px",
    textAlign: "center",
  },

  input: {
    marginBottom: "15px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  button: {
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
  },

  registerBtn: {
    marginTop: "10px",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
};