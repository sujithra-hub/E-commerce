import AdminNavbar from "./AdminNavbar";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <AdminNavbar />
      <div style={{ padding: "20px" }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;