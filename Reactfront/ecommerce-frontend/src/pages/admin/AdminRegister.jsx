import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔥 CALL BACKEND API
      const response = await axios.post(
        "http://localhost:8080/api/auth/admin/register",
        form
      );

      console.log("Response:", response.data);

      alert("Admin Registered Successfully!");

      // redirect after success
      navigate("/admin/login");

    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
      alert("Admin Registration Failed!");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Admin Registration</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          style={styles.input}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button style={styles.button} type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    textAlign: "center",
    fontFamily: "Arial"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px"
  },
  button: {
    padding: "10px",
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};

export default AdminRegister;