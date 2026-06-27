import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

const getImageUrl = (img) => {
  if (!img) return "/default-avatar.png";
  if (img.startsWith("http")) return img;
  return `${BASE_URL}/uploads/${img}`;
};

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    address: "",
    city: "",
    country: "",
    profileImage: ""
  });

  const [imageUrl, setImageUrl] = useState("/default-avatar.png");
  const [file, setFile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(res.data);
      setImageUrl(getImageUrl(res.data.profileImage) + "?t=" + Date.now());

    } catch {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const updateProfile = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/user/profile`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile(res.data);
      setEditMode(false);
      setMessage("Profile updated");
      setError("");

    } catch {
      setError("Update failed");
    }
  };

  const updatePassword = async () => {
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      setError("Enter both passwords");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/user/change-password`,
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordData({ oldPassword: "", newPassword: "" });
      setMessage("Password updated");
      setError("");

    } catch {
      setError("Password update failed");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setImageUrl(URL.createObjectURL(selected));
  };

  const uploadImage = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/user/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      const img = res.data;

      setProfile(prev => ({ ...prev, profileImage: img }));
      setImageUrl(getImageUrl(img) + "?t=" + Date.now());
      setFile(null);

      setMessage("Image uploaded");
      setError("");

    } catch {
      setError("Upload failed");
    }
  };

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h2 style={styles.title}>My Profile</h2>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        {/* IMAGE */}
        <div style={styles.imageSection}>
          <div style={styles.imageWrapper}>
            <img src={imageUrl} alt="profile" style={styles.image} />

            <label style={styles.overlayBtn}>
              📷
              <input type="file" hidden onChange={handleFileChange} />
            </label>
          </div>

          <button
            style={styles.uploadBtn}
            onClick={uploadImage}
            disabled={!file}
          >
            Upload
          </button>
        </div>

        {/* FORM */}
        <div style={styles.form}>
          <Input label="Name" name="name" value={profile.name} onChange={handleChange} disabled={!editMode} />
          <Input label="Email" value={profile.email} disabled />
          <Input label="Phone" name="phone" value={profile.phone} onChange={handleChange} disabled={!editMode} />
          <Input label="Address" name="address" value={profile.address} onChange={handleChange} disabled={!editMode} />
          <Input label="City" name="city" value={profile.city} onChange={handleChange} disabled={!editMode} />
          <Input label="Country" name="country" value={profile.country} onChange={handleChange} disabled={!editMode} />
        </div>

        {/* ACTIONS */}
        <div style={styles.actions}>
          {!editMode ? (
            <button style={styles.primaryBtn} onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          ) : (
            <>
              <button style={styles.primaryBtn} onClick={updateProfile}>
                Save
              </button>
              <button style={styles.cancelBtn} onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </>
          )}
        </div>

        {/* PASSWORD */}
        <div style={styles.passwordBox}>
          <h3>Change Password</h3>

          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={passwordData.oldPassword}
            onChange={(e)=>setPasswordData({...passwordData, oldPassword:e.target.value})}
            style={styles.input}
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={passwordData.newPassword}
            onChange={(e)=>setPasswordData({...passwordData, newPassword:e.target.value})}
            style={styles.input}
          />

          <button style={styles.primaryBtn} onClick={updatePassword}>
            Update Password
          </button>
        </div>

      </div>
    </div>
  );
};

const Input = ({ label, value, ...props }) => (
  <div style={styles.inputRow}>
    <label style={styles.label}>{label}</label>
    <input {...props} value={value || ""} style={styles.input} />
  </div>
);

const styles = {
 page: {
  background: "#f3f4f6",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",   // ✅ ADD THIS
  padding: "20px"
},

  card: {
    width: "420px",
    background: "#111827", // dark card
    padding: "60px",
    borderRadius: "12px",
    color: "#fff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },

  title: {
    textAlign: "center",
    color: "#ff6a00"
  },

  imageSection: {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between", // ✅ spreads nicely
  marginBottom: "20px"
},

  imageWrapper: {
    position: "relative",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "3px solid #ff6a00"
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },

  overlayBtn: {
    position: "absolute",
    bottom: "0",
    right: "0",
    background: "#ff6a00",
    padding: "6px",
    borderRadius: "50%",
    cursor: "pointer"
  },

  uploadBtn: {
    padding: "8px 14px",
    background: "#ff6a00",
    border: "none",
    color: "#000",
    cursor: "pointer",
    borderRadius: "6px"
  },

  form: {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "10px"
},

  inputRow: {
  display: "grid",
  gridTemplateColumns: "120px 1fr",
  alignItems: "center",
  gap: "10px"
},

label: {
  fontSize: "13px",
  color: "#aaa",
  textAlign: "left"
},

input: {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #333",
  background: "#1f2937",
  color: "#fff"
},

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },

  primaryBtn: {
    flex: 1,
    padding: "10px",
    background: "#ff6a00",
    border: "none",
    color: "#000",
    cursor: "pointer",
    borderRadius: "6px"
  },

  cancelBtn: {
    flex: 1,
    padding: "10px",
    background: "#374151",
    border: "none",
    color: "#fff",
    borderRadius: "6px"
  },

  passwordBox: {
    marginTop: "20px"
  },

  success: {
    color: "#22c55e",
    textAlign: "center"
  },

  error: {
    color: "#ef4444",
    textAlign: "center"
  }
};

export default Profile;