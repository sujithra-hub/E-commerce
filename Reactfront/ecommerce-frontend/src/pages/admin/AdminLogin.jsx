import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

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

      if (!res.data || res.data === "Invalid credentials") {
        alert("Invalid login");
        return;
      }

      let role = null;

      try {
        const payload = JSON.parse(atob(res.data.split(".")[1]));
        role = payload.role;
        console.log("Detected role:", role);
      } catch (err) {
        console.log("Token decode failed");
      }

      // 🔥 STRICT ADMIN CHECK
      if (!role || role.toLowerCase() !== "admin") {
        alert("Access denied! Only admins can login here.");
        return;
      }

      // ✅ Allow only admin
      localStorage.setItem("token", res.data);
      localStorage.setItem("role", role);

      alert("Admin login successful");
      navigate("/admin/dashboard");

    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Login</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="email"
          placeholder="Admin Email"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={styles.input}
        />

        <button style={styles.button}>Login</button>
      </form>

      <p>
        New admin? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

const styles = {
  container: { width: "300px", margin: "100px auto", textAlign: "center" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px" },
  button: {
    padding: "10px",
    background: "black",
    color: "white",
    border: "none"
  }
};

export default AdminLogin;