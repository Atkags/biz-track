import {useEffect, useState} from "react";
import { authFetch } from "../utils/auth";
import Layout from "../components/Layout";
import DashboardCard from "../components/DashboardCard";
import "../styles/dashboard.css";
import{ FiDollarSign, FiPackage, FiTrendingUp } from "react-icons/fi";

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
    }).catch(() => {
      setError("Couldn't connect to database...");
    })
  }

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
      <div className="dashboard-section">

        <h2>Recent Sales</h2>

        <table>
          <tbody>
           {dashboard.recent_sales?.map((sale) => (

            <tr key={sale.id}>

            <td>{sale.created_at}</td>

            <td>${sale.total_amount}</td>

            <td>{sale.total}</td>

            <td>{sale.date}</td>

          </tr>

          ))}

          </tbody>

        </table>

      </div>
      <div className="dashboard-bottom">

        <div className="dashboard-section">
          Low Stock Products
          <table>
            <tbody>

              {dashboard.low_stock?.map((product)=>(

                <tr key={product.id}>

                  <td>{product.name}</td>

                  <td>{product.stock_quantity}</td>

                  </tr>

              ))}

            </tbody>
          </table>

        </div>

        <div className="dashboard-section">

        Sales Overview

        </div>

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
    </Layout>
  )
}

export default Dashboard;