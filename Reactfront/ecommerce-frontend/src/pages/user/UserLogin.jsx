import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
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

      console.log("LOGIN RESPONSE:", res.data);

      // -------------------------------
      // GET TOKEN (supports both formats)
      // -------------------------------
      const token = res.data?.token || res.data;

      if (!token) {
        alert("Login failed: No token received");
        return;
      }

      // -------------------------------
      // DECODE JWT SAFELY
      // -------------------------------
      let payload = {};
      let role = null;
      let userId = null;

      try {
        payload = JSON.parse(atob(token.split(".")[1]));
        console.log("JWT PAYLOAD:", payload);

        role = payload.role || null;
        userId = payload.userId || payload.id || null;
      } catch (err) {
        console.log("JWT decode failed:", err);
      }

      // -------------------------------
      // OPTIONAL ROLE CHECK (safe)
      // -------------------------------
      if (role && role.toLowerCase() !== "user") {
        alert("Access denied: Only users allowed here");
        return;
      }

      // -------------------------------
      // STORE DATA
      // -------------------------------
      localStorage.setItem("token", token);

      if (role) localStorage.setItem("role", role);
      if (userId) localStorage.setItem("userId", userId);

      alert("User login successful");

      navigate("/Home");
    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert("Login failed. Check backend or credentials.");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>User Login</h2>

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
          Don't have an account?
        </p>

        <button
          type="button"
          style={styles.registerBtn}
          onClick={() => navigate("/register")}
        >
          Register Here
        </button>
      </form>
    </div>
  );
};

export default UserLogin;

/* ================= STYLES ================= */

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
  },

  card: {
    padding: "30px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
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
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },

  registerBtn: {
    marginTop: "10px",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    background: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
};