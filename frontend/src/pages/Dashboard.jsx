import {useEffect, useState} from "react";
import { authFetch } from "../utils/auth"

function Dashboard(){
  const [dashboard, setDashboard] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  },[]);

  function fetchDashboard(){
    authFetch("http://127.0.0.1:8000/api/dashboard/")
    .then((response) => response.json()).
    then((data) => {
      setDashboard(data);
    }).catch((error) => {
      setError("Couldn't connect to database...");
    })
  }

  return(
    <div>
      <h1>
        Dashboard
      </h1>
      <div>
        <h3>
          Total Sales
        </h3>
        <p>{dashboard.products}</p>
      </div>
      <div>
        <h3>
          Total Sales
        </h3>
        <p>{dashboard.sales}</p>
      </div>
      <div>
        <h3>
          Sales Today
        </h3>
        <p>{dashboard.sales_today}</p>
      </div>
      <div>
        <h3>
          Revenue Today
        </h3>
        <p>$ {dashboard.revenue_today}</p>
      </div>
        
      <div>
        <h3>
          Low Stock Products
        </h3>
        <ul>
          {dashboard.low_stock?.map((product) => (
            <li key={product.id}>
              {product.name} <br />
              {product.stock_quantity}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>
          Recent Sales
        </h3>
        <ul>
        {dashboard.recent_sales?.map((sale) => (
          <li key={sale.id}>
            Sale #{sale.id} <br /> Created at: {sale.created_at} <br /> Total amount: {sale.total_amount} <br />
            <ul>
              {sale.sale_items?.map((items) => (
                <li key={items.id}>
                  Product #{items.id} <br /> Product Name: {items.product_name} <br /> Quantity: {items.quantity} <br /> Unit Price: {items.unit_price} <br /> Line total: {items.line_total}

                </li>
              ))}
            </ul>
            
              
            
          </li>
        ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard;