import { Link, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");

    navigate("/login");
  }

  const role = localStorage.getItem("role");

  return (
    <nav className="sidebar">
      <h2>POS System</h2>

      <Link to="/">Dashboard</Link>

      

      <Link to="/sales">Sales</Link>
      <Link to="/sales-history">Sales History</Link>
      {role === "Admin" && (
        <>
          <Link to="/products">Products</Link>
          <Link to="/purchases">Purchases</Link>
          <Link to="/purchase-history">Purchase History</Link>
          <Link to="/reports">Reports</Link>
        </>
      )}
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default Sidebar;