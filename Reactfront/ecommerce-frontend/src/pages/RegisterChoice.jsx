import { useNavigate } from "react-router-dom";

const RegisterChoice = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2>Choose Register Type</h2>

      <div style={styles.box}>
        <button
          style={styles.userBtn}
          onClick={() => navigate("/user/register")}
        >
          Register as User
        </button>

        <button
          style={styles.adminBtn}
          onClick={() => navigate("/admin/register")}
        >
          Register as Admin
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "120px",
    fontFamily: "Arial",
  },
  box: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  userBtn: {
    padding: "12px 20px",
    background: "green",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  adminBtn: {
    padding: "12px 20px",
    background: "red",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};

export default RegisterChoice;