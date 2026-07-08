import {useState, useEffect} from "react";
import { authFetch } from "../utils/auth"

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
    <div>
      {sales.toReversed().map((sale) => (
        <div key={sale.created_at}>
          <h3>Sale #{sale.id}</h3>
          <ul>
            {sale.sale_items?.map((item, index) => (
              <li key={index}>
                Product {item.product_name}
                ×
                {item.quantity}
              </li>
            ))}
          </ul>

          <p>Total: ${sale.total_amount}</p>

          <p>{sale.created_at}</p>
        </div>
      
      ))}
    </div>
  )
}

export default SaleHistory;