import {useState, useEffect} from "react";
import { authFetch } from "../utils/auth";
import Layout from "../components/Layout";

function PurchasesHistory(){
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetchPurchases();
  }, []);

  function fetchPurchases() {
    authFetch("http://127.0.0.1:8000/api/purchases/")
      .then(response => {
      if(!response.ok){
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
      .then((data) => {
        setPurchases(data);
      });
  }

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Purchase History</h1>
          <p className="page-subtitle">Track all recorded purchasing activity and supplier details.</p>
        </div>
      </div>

      <div className="panel-grid">
        {purchases.toReversed().map((purchase) => (
          <div className="panel-card" key={purchase.created_at}>
            <div className="section-header">
              <h3 className="section-title">Purchase #{purchase.id}</h3>
              <span className="section-badge">{purchase.created_at}</span>
            </div>
            <div className="list-meta" style={{ marginBottom: "10px" }}>Supplier: {purchase.supplier}</div>
            <ul className="data-list">
              {purchase.purchase_items?.map((item, index) => (
                <li key={index}>
                  <div className="list-main">
                    <div className="list-title">{item.product_name}</div>
                    <div className="list-meta">Qty {item.quantity} • Unit ${item.unit_price} • Total ${item.line_total}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="total-card" style={{ marginTop: "14px" }}>
              <span>Total</span>
              <span>${purchase.total_amount}</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export default PurchasesHistory;