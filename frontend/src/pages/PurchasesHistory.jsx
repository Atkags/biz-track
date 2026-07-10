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
      {purchases.toReversed().map((purchase) => (
        <div key={purchase.created_at}>
          <h3>Purchase #{purchase.id}</h3>
          <h2>Supplier: {purchase.supplier}</h2>
          <ul>
            {purchase.purchase_items?.map((item, index) => (
              <li key={index}>
                Product {item.product_name}
                ×
                {item.quantity}
                <br />
                Unit Price : {item.unit_price}
                <br />
                Total : {item.line_total}
              </li>
            ))}
          </ul>

          <p>Total: ${purchase.total_amount}</p>

          <p>{purchase.created_at}</p>
        </div>
      
      ))}
    </Layout>
  )
}

export default PurchasesHistory;