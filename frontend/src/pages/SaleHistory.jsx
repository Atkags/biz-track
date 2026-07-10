import {useState, useEffect} from "react";
import { authFetch } from "../utils/auth";
import Layout from "../components/Layout";

function SaleHistory(){
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  function fetchSales() {
    authFetch("http://127.0.0.1:8000/api/sales/")
      .then(response => {
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
      .then((data) => {
        setSales(data);
      });
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Sales History</h1>
          <p className="page-subtitle">Review completed transactions and item breakdowns.</p>
        </div>
      </div>

      <div className="panel-grid">
        {sales.toReversed().map((sale) => (
          <div className="panel-card" key={sale.created_at}>
            <div className="section-header">
              <h3 className="section-title">Sale #{sale.id}</h3>
              <span className="section-badge">{sale.created_at}</span>
            </div>
            <ul className="data-list">
              {sale.sale_items?.map((item, index) => (
                <li key={index}>
                  <div className="list-main">
                    <div className="list-title">{item.product_name}</div>
                    <div className="list-meta">Quantity {item.quantity}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="total-card" style={{ marginTop: "14px" }}>
              <span>Total</span>
              <span>${sale.total_amount}</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default SaleHistory;