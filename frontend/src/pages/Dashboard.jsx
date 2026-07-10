import {useEffect, useState} from "react";
import { authFetch } from "../utils/auth";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import "../styles/dashboard.css";
import{ FiDollarSign, FiPackage, FiTrendingUp } from "react-icons/fi";

function Dashboard(){
  const [dashboard, setDashboard] = useState({});
  const [error, setError] = useState("");

  const fetchDashboard = () => {
    authFetch("http://127.0.0.1:8000/api/dashboard/")
      .then((response) => response.json())
      .then((data) => {
        setDashboard(data);
        setError("");
      })
      .catch(() => {
        setError("Couldn't connect to database...");
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return(
    <Layout>
      <h1>
        Dashboard
      </h1>
      <div className="dashboard-cards">

        <DashboardCard
            title="Today's Sales"
            value={dashboard.sales_today}
            icon={<FiDollarSign />}
        />

        <DashboardCard
            title="Products"
            value={dashboard.products}
            icon={<FiPackage />}
        />

        <DashboardCard
            title="Total Sales"
            value={dashboard.sales}
            icon={<FiDollarSign />}
        />

        <DashboardCard
            title="Revenue Today"
            value={`$${dashboard.revenue_today}`}
            icon={<FiTrendingUp />}
        />

      </div>
      <div className="dashboard-section">
        <h2>Recent Sales</h2>

        {error && <p className="dashboard-error">{error}</p>}

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Sale</th>
              <th>Date</th>
              <th>Total</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.recent_sales?.map((sale) => (
              <tr key={sale.id}>
                <td>#{sale.id}</td>
                <td>{sale.created_at}</td>
                <td>${sale.total_amount}</td>
                <td>
                  <div className="sale-items-list">
                    {sale.sale_items?.map((item) => (
                      <div key={item.id} className="sale-item-row">
                        <span>{item.product_name}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>${item.line_total}</span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dashboard-bottom">

        <div className="dashboard-section">
          <h2>Low Stock Products</h2>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.low_stock?.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.stock_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  )
}

export default Dashboard;