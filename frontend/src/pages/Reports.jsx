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
    return <h2>Loading...</h2>;
  }

  return (
    <Layout>
      <h1>Reports</h1>

      <h2>Today's Sales</h2>
      <p>${report.today_sales}</p>

      <h2>Monthly Sales</h2>
      <p>${report.month_sales}</p>

      <h2>Monthly Purchases</h2>
      <p>${report.month_purchases}</p>

      <h2>Best Selling Products</h2>

      <ul>
        {report.best_selling.map((product, index) => (
          <li key={index}>
            {product.product__name} - {product.quantity_sold}
          </li>
        ))}
      </ul>

      <h2>Low Stock Products</h2>

      <ul>
        {report.low_stock.map((product, index) => (
          <li key={index}>
            {product.name} ({product.stock})
          </li>
        ))}
      </ul>

    </Layout>
  );
}

export default Reports;