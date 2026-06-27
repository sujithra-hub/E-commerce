import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: ""
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================
  // GET PROFILE
  // =========================
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProfile(res.data);
      setLoading(false);
    } catch (err) {
      console.log("Error fetching profile", err);
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const updateProfile = async () => {
    try {
      const res = await axios.put(
        "http://localhost:8080/api/user/profile",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setProfile(res.data);
      setEditMode(false);
      setMessage("Profile updated successfully");
    } catch (err) {
  console.log("FULL ERROR:", err);
  console.log("RESPONSE:", err.response?.data);
  console.log("STATUS:", err.response?.status);
  setMessage("Update failed");
}
  };

  if (loading) {
    return <h3 style={{ textAlign: "center" }}>Loading profile...</h3>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>User Profile</h2>

        {message && <p style={styles.message}>{message}</p>}

        {/* NAME */}
        <label>Name</label>
        <input
          name="name"
          value={profile.name || ""}
          onChange={handleChange}
          disabled={!editMode}
          style={styles.input}
        />

        {/* EMAIL (readonly) */}
        <label>Email</label>
        <input
          name="email"
          value={profile.email || ""}
          disabled
          style={styles.input}
        />

        {/* PHONE */}
        <label>Phone</label>
        <input
          name="phone"
          value={profile.phone || ""}
          onChange={handleChange}
          disabled={!editMode}
          style={styles.input}
        />

        {/* ROLE (readonly) */}
        <label>Role</label>
        <input
          name="role"
          value={profile.role || ""}
          disabled
          style={styles.input}
        />

        {/* BUTTONS */}
        {!editMode ? (
          <button style={styles.button} onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        ) : (
          <div style={styles.buttonGroup}>
            <button style={styles.button} onClick={updateProfile}>
              Save
            </button>

            <button
              style={styles.cancelButton}
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// =========================
// STYLES
// =========================
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "30px"
  },
  card: {
    width: "400px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  cancelButton: {
    padding: "10px",
    background: "gray",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  buttonGroup: {
    display: "flex",
    gap: "10px"
  },
  message: {
    color: "green"
  }
};

export default Profile;