import { useState, useEffect } from "react";

function App(){
  const[products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/products/").
    then((response) => response.json()).
    then((data) => {
      setProducts(data);
    })
    .catch(() => {
      setProducts("Could not connect to backend");
    });
  }, []);

  return(
    <div>
      <h1>
        Products
      </h1>
      <ul>
        {products.map((product) => (
          <li key = {product.id}>
            <strong>
              {product.name} {product.description} {product.price} {product.stock_quantity} {product.image} {product.is_active}
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;