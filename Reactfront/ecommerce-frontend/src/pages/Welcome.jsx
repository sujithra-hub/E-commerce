import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome</h1>

      <button onClick={() => navigate("/user/Userlogin")}>
        Login as User
      </button>

      <button onClick={() => navigate("/admin/Adminlogin")}>
        Login as Admin
      </button>
    </div>
  );
}

export default Welcome;