import { useState, useEffect } from "react";

function Sales() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  function fetchProducts() {
    fetch("http://127.0.0.1:8000/api/products/", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setError("Couldn't connect to backend...");
      });
  }

  const filteredItems = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1>Sales</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Search Product"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ul>
        {filteredItems.length > 0 ? (
          filteredItems.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong> - ${product.price}
            </li>
          ))
        ) : (
          <li style={{ color: "red", fontStyle: "italic" }}>
            No products found
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sales;