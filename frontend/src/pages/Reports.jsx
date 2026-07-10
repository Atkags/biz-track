import { useState, useEffect } from "react";
import { authFetch } from "../utils/auth";
import Layout from "../components/Layout";

function Reports() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  function fetchReport() {
    authFetch("http://127.0.0.1:8000/api/reports/")
      .then((response) => response.json())
      .then((data) => setReport(data));
  }

  if (!report) {
    return (
      <Layout>
        <div className="panel-card">
          <h2 className="page-title">Loading...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Monitor sales performance, purchases, and stock health.</p>
        </div>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Today's Sales</div>
          <div className="metric-value">${report.today_sales}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Monthly Sales</div>
          <div className="metric-value">${report.month_sales}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Monthly Purchases</div>
          <div className="metric-value">${report.month_purchases}</div>
        </div>
      </div>

      <div className="panel-grid" style={{ marginTop: "20px" }}>
        <div className="data-card">
          <div className="section-header" style={{ padding: "16px 16px 0" }}>
            <h2 className="section-title">Best Selling Products</h2>
          </div>
          <ul className="data-list">
            {report.best_selling.map((product, index) => (
              <li key={index}>
                <div className="list-main">
                  <div className="list-title">{product.product__name}</div>
                  <div className="list-meta">{product.quantity_sold} units sold</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="data-card">
          <div className="section-header" style={{ padding: "16px 16px 0" }}>
            <h2 className="section-title">Low Stock Products</h2>
          </div>
          <ul className="data-list">
            {report.low_stock.map((product, index) => (
              <li key={index}>
                <div className="list-main">
                  <div className="list-title">{product.name}</div>
                  <div className="list-meta">{product.stock} units remaining</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default Reports;